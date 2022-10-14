import { existsSync, readFile } from "fs";
import mimeTypes from "../constants/mime.js";

export default function(path) {
    let contentType = mimeTypes[path.replace(/.*\./, '.').toLowerCase()];
    if (existsSync(path)) {
        readFile(path, (error, data) => {
            if (error) {
                this.writeHead(500);
                this.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            } else {
                this.writeHead(200, { 'Content-Type': contentType });
                this.end(data, "utf-8");
            }
        });
    } else {
        readFile("public/404.html", (error, content) => {
            this.writeHead(404, { 'Content-Type': error ? 'text/plain' : 'text/html' });
            this.end(content || "Error: File Not Found", "utf-8");
        });
    }

    return this;
}