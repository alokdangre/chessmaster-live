import { WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";

export class Player {
  id: string;
  gameId: string | null;
  socket: WebSocket;

  constructor(socket: WebSocket) {
    this.socket = socket;
    this.gameId = null;
    this.id = uuidv4();
  }

  send(message: Object): void {
    try {
      this.socket.send(JSON.stringify(message));
    } catch (error) {
      console.error(`Failed to send message to player ${this.id}:`, error);
    }
  }
}
