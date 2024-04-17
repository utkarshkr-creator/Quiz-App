"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const server = http_1.default.createServer();
const io = new socket_io_1.Server(server);
io.on('connection', client => {
    client.on('event', data => {
        console.log(data);
    });
    //client.send("websocket connected")
});
server.listen(8000);
