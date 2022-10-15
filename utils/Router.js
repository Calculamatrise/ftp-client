import EventEmitter from "events";
import { existsSync, readFile } from "fs";
import { METHODS } from "http";
import sendFile from "./sendFile.js";

export default class Router extends EventEmitter {
    #routes = new Map();
    _route(req, res) {
        const route = this.#routes.get(req.method);
        const callback = route.get(req.url);
        if (typeof callback == 'function') {
            callback(...arguments);
        } else {
            switch(req.method) {
                case 'GET': {
                    sendFile.call(res, `public/${req.url}${/\.\w*$/.test(req.url) ? '' : '/index.html'}`);
                    break;
                }

                case 'POST': {
                    var path = `public/${req.url}${/\.\w*$/.test(req.url) ? '' : '/index.js'}`;
                    if (existsSync(path)) {
                        readFile(path, async (error, data) => {
                            if (error) {
                                res.writeHead(500);
                                res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                            } else {
                                res.writeHead(200, {'Content-Type': 'application/json'});
                                let response = await eval(`(async ()=>{${data}})();`);
                                try {
                                    response = JSON.stringify(response);
                                } catch {
                                    response = "Unrecognized endpoint";
                                }
                                res.end(response, 'utf8');
                            }
                        });
                    }
                    break;
                }
            }
        }
    }

    _routeMap(method) {
        if (!this.#routes.has(method)) {
            this.#routes.set(method, new Map());
        }

        return this.#routes.get(method);
    }
}

for (const method of METHODS) {
    Router.prototype[method.toLowerCase()] = function(path, callback) {
        if (typeof path != 'string' && !(path instanceof RegExp)) {
            throw new TypeError("Path must be of type: string");
        } else if (typeof callback != 'function') {
            throw new TypeError("Callback must be a function");
        }

        this._routeMap(method).set(path, callback);
    }
}