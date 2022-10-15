void function(script) {
    const { searchParams } = new URL(script.src);
    fetch(searchParams.get('src')).then(r => r.text()).then(content => {
        injectScripts(script.outerHTML = content);
    });
}(document.currentScript);

function injectScripts(content) {
    const div = document.createElement('div');
    div.innerHTML = content;
    for (const script of div.querySelectorAll("script")) {
        document.head.appendChild(cloneNode(script));
    }
}

function cloneNode(node) {
    let clone  = document.createElement(node.tagName);
    clone.text = node.innerHTML;
    for (const attr of node.attributes) {                                    
        clone.setAttribute(attr.name, attr.value);
    }

    return clone;
}