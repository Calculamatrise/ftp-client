export default class {
    connect(payload) {
        return fetch('/connect', {
            body: JSON.stringify(payload),
            method: 'post'
        }).then(r => r.json());
    }
}