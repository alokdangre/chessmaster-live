import { WebSocket } from "ws";
import { Player } from "./Player";
import { Chess, Square } from 'chess.js'
import { GameManager } from "./GameManager";

export class Game {
    id: string;
    players: Map<string, Player>;
    chess: Chess;
    spectators: Player[];
    timers: {white: number; black: number};
    currentTurn: "white" | "black";
    timeInterval: NodeJS.Timeout | null;
    gameManager: GameManager;

    constructor(id: string, player1: Player,player2: Player, initialTime = 300,gameManager : GameManager) {
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
        this.gameManager = gameManager

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
                this.endGame(`${winner} wins by timeout!`,winner)
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
            this.endGame("Your opponent disconnected. You win!","disconnected");
        }
    }

    makeMove(from: string, to : string, sender: WebSocket, promotion?: string): void {
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

        const moves = this.chess.moves({ square: from as Square, verbose: true });
    const isPawnPromotion = moves.some(
        (move) => move.to === to && move.promotion
    );

    let moveResult;
    if (isPawnPromotion) {
        if (!promotion || !["q", "r", "b", "n"].includes(promotion)) {
            sender.send(JSON.stringify({
                type: 'error',
                message: "Invalid or missing promotion piece. Valid options are q, r, b, n.",
            }));
            return;
        }
        moveResult = this.chess.move({ from, to, promotion });
    } else {
        moveResult = this.chess.move({ from, to });
    }

    if (moveResult) {
        this.currentTurn = this.currentTurn === 'white' ? "black" : "white";
        this.broadcast({
            type: 'updateMove',
            move: { from, to, promotion: promotion || null },
            boardState: this.chess.fen(),
            timers: this.timers,
        });
    } else {
        sender.send(JSON.stringify({
            type: 'error',
            message: "Invalid move",
        }));
        return;
    }
        
        if(this.chess.isCheckmate()) {
            const winner = this.currentTurn === "white" ? "Black" : "White";
            this.endGame(`${winner} wins by checkmate!`,winner);
            console.log(winner);
        }
        else if(this.chess.isStalemate()) {
            this.endGame(`Game ends in a stalemate`,"draw");
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

    endGame(message: string,winner: string): void {
        if(this.timeInterval) clearInterval(this.timeInterval);
        console.log(winner);

        this.broadcast({
            type: 'gameOver',
            message,
            boardState: this.chess.fen(),
            winner
        })

        this.gameManager.removeGame(this.id);

        console.log(message);
    }
}
