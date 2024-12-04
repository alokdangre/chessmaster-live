"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const uuid_1 = require("uuid");
class Player {
    constructor(socket) {
        this.socket = socket;
        this.gameId = null;
        this.id = (0, uuid_1.v4)();
    }
    send(message) {
        try {
            this.socket.send(JSON.stringify(message));
        }
        catch (error) {
            console.error(`Failed to send message to player ${this.id}:`, error);
        }
    }
}
exports.Player = Player;
