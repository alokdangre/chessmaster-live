"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const Game_1 = require("./Game");
const uuid_1 = require("uuid");
class GameManager {
    constructor() {
        this.waitingPlayer = null;
        this.games = {};
    }
    addPlayer(player) {
        if (this.waitingPlayer === null) {
            this.waitingPlayer = player;
            this.waitingPlayer.send({ type: 'waiting', message: "Waiting for an opponent..." });
        }
        else {
            const gameId = (0, uuid_1.v4)();
            player.gameId = gameId;
            this.waitingPlayer.gameId = gameId;
            const newGame = new Game_1.Game(gameId, this.waitingPlayer, player);
            this.games[gameId] = newGame;
            this.waitingPlayer.send({ type: 'startGame', gameId, color: 'white' });
            player.send({ type: 'startGame', gameId, color: 'black' });
            this.waitingPlayer = null;
        }
    }
    removePlayer(player) {
        if (this.waitingPlayer === player) {
            this.waitingPlayer = null;
        }
        if (player.gameId && this.games[player.gameId]) {
            const game = this.games[player.gameId];
            game.handleDisconnection(player);
            delete this.games[player.gameId];
        }
    }
    addGame(player1, player2) {
        const gameId = (0, uuid_1.v4)();
        player1.gameId = gameId;
        player2.gameId = gameId;
        const newGame = new Game_1.Game(gameId, player1, player2);
        this.games[gameId] = newGame;
        return gameId;
    }
    addSpectator(spectator, gameId) {
        if (this.games[gameId]) {
            this.games[gameId].addSpectator(spectator);
        }
        else {
            spectator.send({ type: 'error', message: 'Game not found' });
        }
    }
    getGame(gameId) {
        return this.games[gameId] || null;
    }
    removeGame(gameId) {
        const game = this.games[gameId];
        if (!game)
            return;
        game.broadcast({
            type: "gameOver",
            message: "The game has ended.",
            boardState: game.chess.fen(),
        });
        game.players.forEach((player) => {
            player.gameId = null;
        });
        game.spectators.forEach((spectator) => {
            spectator.gameId = null;
        });
        delete this.games[gameId];
        console.log(`Game ${gameId} has been removed.`);
    }
}
exports.GameManager = GameManager;
