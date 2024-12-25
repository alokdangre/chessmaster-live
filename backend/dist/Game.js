"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
class Game {
    constructor(id, player1, player2, initialTime = 300) {
        this.id = id;
        this.players = new Map([
            ["white", player1],
            ["black", player2],
        ]);
        this.chess = new chess_js_1.Chess();
        this.spectators = [];
        this.timers = { white: initialTime, black: initialTime };
        this.currentTurn = "white";
        this.timeInterval = null;
        this.startTimer();
    }
    startTimer() {
        this.timeInterval = setInterval(() => {
            const currentColor = this.currentTurn;
            if (this.timers[currentColor] > 0) {
                this.timers[currentColor] -= 1;
                this.broadcast({
                    type: "updateTimer",
                    timers: this.timers,
                });
            }
            else {
                clearInterval(this.timeInterval);
                this.timeInterval = null;
                const winner = currentColor === "white" ? "Black" : "White";
                this.endGame(`${winner} wins by timeout!`, winner);
            }
        }, 1000);
    }
    broadcast(message, excludeSocket = null) {
        const serializedMessage = JSON.stringify(message);
        this.players.forEach((player) => {
            if (player.socket !== excludeSocket) {
                player.send(serializedMessage);
            }
        });
        this.spectators.forEach((spectator) => spectator.send(serializedMessage));
    }
    addSpectator(spectator) {
        this.spectators.push(spectator);
        spectator.send(JSON.stringify({ type: "spectate", boardState: this.chess.fen() }));
    }
    handleDisconnection(disconnectedPlayer) {
        const remainingPlayer = Array.from(this.players.values()).find((player) => player !== disconnectedPlayer);
        if (remainingPlayer) {
            this.endGame("Your opponent disconnected. You win!", "disconnected");
        }
    }
    makeMove(from, to, sender, promotion) {
        const playerColor = this.getPlayerColor(sender);
        if (playerColor !== this.currentTurn) {
            sender.send(JSON.stringify({
                type: "error",
                message: "It's not your turn",
            }));
            return;
        }
        const moves = this.chess.moves({ square: from, verbose: true });
        const isPawnPromotion = moves.some((move) => move.to === to && move.promotion);
        let moveResult;
        if (isPawnPromotion) {
            if (!promotion || !["q", "r", "b", "n"].includes(promotion)) {
                sender.send(JSON.stringify({
                    type: "error",
                    message: "Invalid or missing promotion piece. Valid options are q, r, b, n.",
                }));
                return;
            }
            console.log(from, to, promotion);
            moveResult = this.chess.move({ from, to, promotion });
        }
        else {
            console.log(from, to);
            moveResult = this.chess.move({ from, to });
        }
        console.log(moveResult);
        if (moveResult) {
            console.log("Valid move");
            this.currentTurn = this.currentTurn === "white" ? "black" : "white";
            this.broadcast({
                type: "updateMove",
                move: { from, to, promotion },
                boardState: this.chess.fen(),
                timers: this.timers,
            });
        }
        else {
            sender.send(JSON.stringify({
                type: "error",
                message: "Invalid move",
            }));
            return;
        }
        if (this.chess.isCheckmate()) {
            const winner = this.currentTurn === "white" ? "Black" : "White";
            this.endGame(`${winner} wins by checkmate!`, winner);
        }
        else if (this.chess.isStalemate()) {
            this.endGame("Game ends in a stalemate", "draw");
        }
    }
    getPlayerColor(socket) {
        for (const [color, player] of this.players.entries()) {
            if (player.socket === socket) {
                return color;
            }
        }
        return null;
    }
    endGame(message, winner) {
        if (this.timeInterval) {
            clearInterval(this.timeInterval);
            this.timeInterval = null;
        }
        this.broadcast({
            type: "gameOver",
            message,
            boardState: this.chess.fen(),
            winner,
        });
    }
}
exports.Game = Game;
