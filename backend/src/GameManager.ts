import { Game } from "./Game";
import { Player } from "./Player";
import { v4 as uuidv4 } from "uuid";

export class GameManager {
  waitingPlayer: Player | null;
  games: { [gameId: string]: Game };

  constructor() {
    this.waitingPlayer = null;
    this.games = {};
  }

  addPlayer(player: Player): void {
    if (this.waitingPlayer === null) {
      this.waitingPlayer = player;
      this.waitingPlayer.send({
        type: "waiting",
        message: "Waiting for an opponent...",
      });
      console.log("Waiting for an opponent...");
    } else {
      const gameId = uuidv4();
      player.gameId = gameId;
      this.waitingPlayer.gameId = gameId;
      const newGame = new Game(gameId, this.waitingPlayer, player, 10, this);

      this.games[gameId] = newGame;
      this.waitingPlayer.send({ type: "startGame", gameId, color: "white" });
      player.send({ type: "startGame", gameId, color: "black" });

      console.log("Game started");

      this.waitingPlayer = null;
    }
  }

  removePlayer(player: Player): void {
    if (this.waitingPlayer === player) {
      this.waitingPlayer = null;
    }
    if (player.gameId && this.games[player.gameId]) {
      const game = this.games[player.gameId];
      game.handleDisconnection(player);
      delete this.games[player.gameId];
    }
  }

  addGame(player1: Player, player2: Player): string {
    const gameId = uuidv4();
    player1.gameId = gameId;
    player2.gameId = gameId;

    const newGame = new Game(gameId, player1, player2, 10, this);
    this.games[gameId] = newGame;

    return gameId;
  }

  addSpectator(spectator: Player, gameId: string): void {
    if (this.games[gameId]) {
      this.games[gameId].addSpectator(spectator);
      const boardState = this.games[gameId].chess.fen();
      spectator.send({ type: "spectateGame", boardState });
    } else {
      spectator.send({ type: "error", message: "Game not found" });
    }
  }

  getGame(gameId: string): Game | null {
    return this.games[gameId] || null;
  }

  removeGame(gameId: string): void {
    const game = this.games[gameId];
    if (!game) return;

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
