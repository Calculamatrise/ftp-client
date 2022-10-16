import http from "http";
import client from "./client.js";
import handler from "./handler.js";
import Router from "./utils/Router.js";
import sendFile from "./utils/sendFile.js";
import { WebSocketServer } from 'ws';

const server = http.createServer(handler);
const wss = new WebSocketServer({ server });

wss.on('connection', function(ws) {
    ws.on('message', function(data) {
        console.log('received: %s', data);
    });

    ws.send('reply');
});

export const router = new Router();

router.post('/connect', function(req, res) {
    client.once('ready', ready);
    client.once('error', error);
    client.connect({
        host: req.body.host || 'localhost',
        port: ~~req.body.port || 21,
        user: req.body.user || 'anonymous',
        password: req.body.password || 'anonymous@'
    });

    function ready() {
        client.off('error', error);
        client.list(function(err, list) {
            if (err) throw err;
            client.end();
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify({
                result: 'success',
                data: list
            }));
            res.end();
        });
    }

    function error(err) {
        client.off('ready', ready);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.write(JSON.stringify({
            result: 'error',
            error: err.message
        }));
        res.end();
    }
});

server.listen(8080, () => {
    console.log(`Listening on port: ${server.address().port}!`);
});