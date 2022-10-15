import { router } from "./server.js";

export default async function(req, res) {
    let params = null;
    req.url = req.url.replace(/\?.*/, match => {
        params = new URLSearchParams(match);
        return '';
    });

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
            res.write(JSON.stringify({
                error: err.message || err,
                res: false
            }));
            return;
        }
    }

    switch(req.method) {
        default: {
            router._route(...arguments);
        }
    }
}