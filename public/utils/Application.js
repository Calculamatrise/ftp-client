import EventEmitter from "./EventEmitter.js";
import FileManager from "./FileManager.js";
import Router from "./Router.js";

export default class extends EventEmitter {
    files = new FileManager();
    router = new Router();
}