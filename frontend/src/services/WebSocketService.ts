import EventEmitter from "eventemitter3";

type EventCallback<T = object> = (data: T) => void;

export class WebSocketService {
    private static instance: WebSocketService;
    private socket: WebSocket | null = null;
    private events = new EventEmitter();

    private constructor() {}

    static getInstance(): WebSocketService {
        if(!this.instance) {
            this.instance = new WebSocketService();
        }
        return this.instance;
    }

    isConnected(): boolean {
        if(this.socket === null) return false;
        else return true;
    }

    connect(url: string): void {
        if(this.socket) return;
        this.socket = new WebSocket(url);

        this.socket.onopen = () => console.log("Connected to WebSocket server.");
        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.events.emit(data.type, data);
        }
        this.socket.onclose = () => console.log("WebSocket disconnected");
        this.socket.onerror = (error) => console.error("Websocket error:", error);
    }

    send(data: object): void {
        if(this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        } else {
            console.error("Websocket is not connected");
        }
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }

    on<T = object>(event: string, callback: EventCallback<T>) {
        this.events.on(event, callback);
    }

    off<T = object>(event: string, callback: EventCallback<T>) {
        this.events.off(event, callback);
    }
}