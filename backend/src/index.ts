import { WebSocket, WebSocketServer } from "ws";
import { GameManager } from "./GameManager";
import { Player } from "./Player";
import { MessageHandler } from "./MessageHandler";
import dotenv from "dotenv";
dotenv.config();

const wss = new WebSocketServer({ port: process.env.PORT ? parseInt(process.env.PORT) : 8000 });
const gameManager = new GameManager();
const onlinePlayers: { [playerId: string]: Player } = {};

const messageHandler = new MessageHandler(gameManager, onlinePlayers);

wss.on("connection", (ws: WebSocket) => {
  ws.on("error", console.error);

  const player = new Player(ws);
  onlinePlayers[player.id] = player;

  ws.on("message", (message: string) => {
    try {
      const data = JSON.parse(message);
      messageHandler.handleMessage(player, data);
    } catch (error) {
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
        game.broadcast(
          {
            type: "opponentDisconnected",
            message: "Your opponent has disconnected.",
          },
          ws
        );
      }
    }
  });

  ws.send(
    JSON.stringify({ type: "connection", message: "Connected to the server" })
  );
});
