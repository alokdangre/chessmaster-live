import { GameManager } from "./GameManager";
import { Player } from "./Player";
import { InvitationManager } from "./InvitationManager";

export class MessageHandler {
  private gameManager: GameManager;
  private invitationManager: InvitationManager;
  private onlinePlayers: { [playerId: string]: Player };

  constructor(gameManager: GameManager, onlinePlayers: { [playerId: string]: Player }) {
    this.gameManager = gameManager;
    this.onlinePlayers = onlinePlayers;
    this.invitationManager = new InvitationManager(gameManager);
  }

  handleMessage(player: Player, data: any): void {
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

  private handleSpectate(player: Player, data: any): void {
    if (data.gameId) {
      const game = this.gameManager.getGame(data.gameId);
      if (game) {
        this.gameManager.addSpectator(player, data.gameId);
      } else {
        player.send({
          type: "error",
          message: `Game ID ${data.gameId} is invalid.`,
        });
      }
    } else {
      const availableGames = Object.values(this.gameManager.games);
      if (availableGames.length > 0) {
        const randomGame =
          availableGames[Math.floor(Math.random() * availableGames.length)];
        this.gameManager.addSpectator(player, randomGame.id);
      } else {
        player.send({
          type: "error",
          message: "No games available to spectate.",
        });
      }
    }
  }

  private handleMakeMove(player: Player, data: any): void {
    console.log(data);
    if (!player.gameId) {
      player.send({ type: "error", message: "You are not in a game." });
      return;
    }

    const game = this.gameManager.getGame(player.gameId);
    if (!game) {
      player.send({ type: "error", message: "Game not found." });
      return;
    }

    game.makeMove(data.from, data.to, player.socket, data.promotion);
  }

  private handleGameOver(player: Player): void {
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
