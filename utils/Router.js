import EventEmitter from "events";
import { METHODS } from "http";
import sendFile from "./sendFile.js";

export default class Router extends EventEmitter {
    #routes = new Map();
    _route(req, res) {
        const route = this.#routes.get(req.method);
        const callback = route.get(req.url);
        if (typeof callback == 'function') {
            callback(...arguments);
        } else if (req.method == 'GET') {
            sendFile.call(res, 'public/' + req.url);
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
        if (typeof path != 'string') {
            throw new TypeError("Path must be of type: string or RegExp");
        } else if (typeof callback != 'function') {
            throw new TypeError("Callback must be a function");
        }

        this._routeMap(method).set(path, callback);
    }
}