import EventEmitter from "./EventEmitter.js";

export default class extends EventEmitter {
    constructor() {
        super();
        window.addEventListener('popstate', () => {
            this.route(location.pathname, {
                replaceState: true
            });
        });
    }

    async route(pathname, options = {}) {
        options.replaceState = options.replace ?? pathname == location.pathname;
        history[(options.replaceState ? 'replace' : 'push') + 'State'](document.body.innerHTML, document.title, pathname);
        const main = document.querySelector('main') ?? document.appendChild(document.createElement('main'));
        main.innerHTML = await readFile(pathname);
        this.emit(pathname);
    }
}

var scriptsLoaded = scriptsLoaded || new Set();
function readFile(pathname, ignoreScripts = false) {
    const parser = new DOMParser();
    return fetch(pathname).then(r => r.text()).then(raw => {
        const parsed = parser.parseFromString(raw, "text/html");
        const main = parsed.querySelector('main') ?? parsed.body;
        for (const script of main.querySelectorAll("script")) {
            if (script.hasAttribute('src')) {
                if (scriptsLoaded.has(script.src)) {
                    continue;
                }

                scriptsLoaded.add(script.src);
            } else {
                if (scriptsLoaded.has(script.innerText)) {
                    continue;
                }

                scriptsLoaded.add(script.innerText);
            }

            document.head.appendChild(cloneNode(script));
        }

        return main.innerHTML;
    });
}

function cloneNode(node) {
    let clone  = document.createElement(node.tagName);
    clone.text = node.innerHTML;
    for (const attr of node.attributes) {                                    
        clone.setAttribute(attr.name, attr.value);
    }

    return clone;
}