import { client } from "./client.js";
import { router } from "./server.js";

export default async function(req, res) {
    console.log(req.method, req.url);

    const buffers = [];
    for await (const chunk of req) {
        buffers.push(chunk);
    }

    req.body = Buffer.concat(buffers).toString() || null;
    if (req.body !== null) {
        try {
            req.body = JSON.parse(req.body);
        } catch(err) {
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.write({
                error: err.message || err,
                res: false
            });
            return;
        }
    }

    switch(req.method) {
        default: {
            router._route(...arguments);
        }
    }
}