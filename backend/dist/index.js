"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const GameManager_1 = require("./GameManager");
const Player_1 = require("./Player");
const MessageHandler_1 = require("./MessageHandler");
const wss = new ws_1.WebSocketServer({ port: process.env.PORT ? parseInt(process.env.PORT) : undefined });
const gameManager = new GameManager_1.GameManager();
const onlinePlayers = {};
const messageHandler = new MessageHandler_1.MessageHandler(gameManager, onlinePlayers);
wss.on("connection", (ws) => {
    ws.on("error", console.error);
    const player = new Player_1.Player(ws);
    onlinePlayers[player.id] = player;
    ws.on("message", (message) => {
        try {
            const data = JSON.parse(message);
            messageHandler.handleMessage(player, data);
        }
        catch (error) {
            console.error("Error processing message:", error);
            player.send({ type: "error", message: "Invalid message format." });
        }
    });
    ws.on("close", () => {
        console.log(`Player ${player.id} disconnected`);
        delete onlinePlayers[player.id];
        gameManager.removePlayer(player);
        if (player.gameId) {
            const game = gameManager.getGame(player.gameId);
            if (game) {
                game.broadcast({
                    type: "opponentDisconnected",
                    message: "Your opponent has disconnected.",
                }, ws);
            }
        }
    });
    ws.send(JSON.stringify({ type: "connection", message: "Connected to the server" }));
});
