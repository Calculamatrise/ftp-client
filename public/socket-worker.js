const connectedPorts = [];

const socket = new WebSocket("ws://tpc.example.com/");

socket.addEventListener('message', ({ data }) => {
    console.log("?")
    const payload = JSON.parse(data);
    connectedPorts.forEach(port => {
        port.postMessage(payload);
    });
});

self.addEventListener('connect', function(event) {
    console.log("???")
    const port = event.ports[0];

    connectedPorts.push(port);

    port.addEventListener('message', event => {
        const { action, data } = event;
        console.log(data)
        if (action == 'unload') {
            connectedPorts.splice(connectedPorts.indexOf(port), 1);
            return;
        }

        port.postMessage('data');
    });

    port.start();
});