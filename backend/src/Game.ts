import { WebSocket } from "ws";
import { Player } from "./Player";
import { Chess } from 'chess.js'

export class Game {
    id: string;
    players: Map<string, Player>;
    chess: Chess;
    spectators: Player[];
    timers: {white: number; black: number};
    currentTurn: "white" | "black";
    timeInterval: NodeJS.Timeout | null;

    constructor(id: string, player1: Player,player2: Player, initialTime = 300) {
        this.id = id;
        this.players = new Map<string, Player>([
            ["white", player1],
            ["black", player2],
        ]);
        this.chess = new Chess();
        this.spectators = [];
        this.timers = {white: initialTime, black: initialTime};
        this.currentTurn = "white";
        this.timeInterval = null;

        this.startTimer();
    }

    private startTimer(): void {
        this.timeInterval = setInterval(() => {
            const currentColor = this.currentTurn;

            if(this.timers[currentColor] > 0) {
                this.timers[currentColor] -= 1;
                this.broadcast({
                    type: "updateTimer",
                    timers: this.timers,
                });
            } else {
                clearInterval(this.timeInterval!);
                const winner = currentColor === "white" ? "Black" : "White";
                this.endGame(`${winner} wins by timeout!`)
            }
        }, 1000);
    }

    broadcast(message: Object, excludeSocket: WebSocket | null = null): void {
        this.players.forEach((player) => {
            if(player.socket !== excludeSocket) {
                player.send(message);
            }
        });

        this.spectators.forEach((spectator) => spectator.send(message));
    }

    addSpectator(spectator: Player) {
        this.spectators.push(spectator);
        spectator.send({ type: 'spectate', boardState: this.chess.fen() });
    }

    handleDisconnection(disconnectedPlayer: Player): void {
        const remainingPlayer = Array.from(this.players.values()).find((player) => player !== disconnectedPlayer);

        if(remainingPlayer) {
            this.endGame("Your opponent disconnected. You win!");
        }
    }

    makeMove(from: string, to : string, sender: WebSocket): void {
        const playerColor = this.getPlayerColor(sender);

        if(playerColor !== this.currentTurn) {
            sender.send(
                JSON.stringify({
                    type: 'error',
                    message: "It's not your turn",
                })
            )
            return;
        }

        const result = this.chess.move({from, to});
        console.log(result);

        if(result) {
            this.currentTurn = this.currentTurn === 'white' ? "black" : "white";
            this.broadcast({
                type: 'updateMove',
                move: {from, to},
                boardState: this.chess.fen(),
                timers: this.timers,
            });
        }
        else if(this.chess.isCheckmate()) {
            const winner = this.currentTurn === "white" ? "Black" : "White";
            this.endGame(`${winner} wins by checkmate!`);
        }
        else if(this.chess.isStalemate()) {
            this.endGame(`Game ends in a stalemate`);
        }
        else {
            sender.send(
                JSON.stringify({
                    type: 'error',
                    message: "Invalid move",
                })
            )
        }
    }

    getPlayerColor(socket: WebSocket): string | null {
        for(const [color, player] of this.players.entries()) {
            if(player.socket === socket) {
                return color;
            }
        }
        return null;
    }

    private endGame(message: string): void {
        if(this.timeInterval) clearInterval(this.timeInterval);

        this.broadcast({
            type: 'gameOver',
            message,
            boardState: this.chess.fen(),
        })

        console.log(message);
    }
}