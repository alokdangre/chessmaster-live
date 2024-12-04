"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageHandler = void 0;
const InvitationManager_1 = require("./InvitationManager");
class MessageHandler {
    constructor(gameManager, onlinePlayers) {
        this.gameManager = gameManager;
        this.onlinePlayers = onlinePlayers;
        this.invitationManager = new InvitationManager_1.InvitationManager(gameManager);
    }
    handleMessage(player, data) {
        switch (data.type) {
            case "joinGame":
                this.gameManager.addPlayer(player);
                break;
            case "spectate":
                this.handleSpectate(player, data);
                break;
            case "makeMove":
                this.handleMakeMove(player, data);
                break;
            case "gameOver":
                this.handleGameOver(player);
                break;
            case "inviteFriend":
            case "acceptInvite":
                this.invitationManager.handleInvitation(data, player, this.onlinePlayers);
                break;
            default:
                player.send({ type: "error", message: "Invalid message type." });
        }
    }
    handleSpectate(player, data) {
        if (data.gameId) {
            const game = this.gameManager.getGame(data.gameId);
            if (game) {
                this.gameManager.addSpectator(player, data.gameId);
            }
            else {
                player.send({
                    type: "error",
                    message: `Game ID ${data.gameId} is invalid.`,
                });
            }
        }
        else {
            const availableGames = Object.values(this.gameManager.games);
            if (availableGames.length > 0) {
                const randomGame = availableGames[Math.floor(Math.random() * availableGames.length)];
                this.gameManager.addSpectator(player, randomGame.id);
            }
            else {
                player.send({
                    type: "error",
                    message: "No games available to spectate.",
                });
            }
        }
    }
    handleMakeMove(player, data) {
        if (!player.gameId) {
            player.send({ type: "error", message: "You are not in a game." });
            return;
        }
        const game = this.gameManager.getGame(player.gameId);
        if (!game) {
            player.send({ type: "error", message: "Game not found." });
            return;
        }
        game.makeMove(data.from, data.to, player.socket);
    }
    handleGameOver(player) {
        if (!player.gameId) {
            player.send({ type: "error", message: "You are not part of a game." });
            return;
        }
        const game = this.gameManager.getGame(player.gameId);
        if (!game) {
            player.send({ type: "error", message: "Game not found." });
            return;
        }
        this.gameManager.removeGame(player.gameId);
    }
}
exports.MessageHandler = MessageHandler;
