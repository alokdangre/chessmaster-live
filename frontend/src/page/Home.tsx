import { Button } from "@/components/ui/button";
import { WebSocketService } from "../services/WebSocketService"
import { useEffect } from "react";

const Home: React.FC = () => {
    const ws = WebSocketService.getInstance();

    useEffect(() => {
        ws.connect("ws://localhost:8000");

        const handleMessage = (data: object) => {
            console.log("Received data:", data); 
        };
        ws.onMessage(handleMessage);

        return () => {
            ws.disconnect();
        };
    }, [ws]);

    const handlePlay = () => ws.send({ type: "joinGame" });

    return <div className="h-screen flex flex-col bg-green-600 min-w-full min-h-full justify-center">
        <Button onClick={handlePlay}>Play</Button>
        <Button>Spectate</Button>
    </div>
}

export default Home;