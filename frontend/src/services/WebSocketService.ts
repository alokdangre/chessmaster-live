export class WebSocketService {
    private static instance: WebSocketService;
    private socket: WebSocket | null = null;

    private constructor() {}

    static getInstance(): WebSocketService {
        if(!this.instance) {
            this.instance = new WebSocketService();
        }
        return this.instance;
    }

    connect(url: string): void {
        this.socket = new WebSocket(url);
        this.socket.onopen = () => console.log("Connected to WebSocket server.");
        this.socket.onerror = (error) => console.error("Websocket error:", error);
    }

    send(data: object): void {
        if(this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        } else {
            console.error("Websocket is not connected");
        }
    }

    onMessage(callback: (data: JSON) => void): void {
        this.socket!.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Received data:", data);
            callback(data);
        };
    }

    public disconnect(): void {
        if (this.socket) {
            this.socket.close();
        }
    }
}