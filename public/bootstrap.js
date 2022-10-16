import App from "./utils/Application.js";

window.Application = new App();

class NavigationLink extends HTMLElement {
    get href() {
        return this.getAttribute('href');
    }

    set href(value) {
        this.setAttribute('href', value);
    }

    constructor() {
        super();
        this.addEventListener('click', function() {
            Application.router.route(this.href);
        });
    }
}

customElements.define('nav-link', NavigationLink);