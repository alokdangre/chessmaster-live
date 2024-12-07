import { Button } from "@/components/ui/button";
import { WebSocketService } from "../services/WebSocketService";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
    const ws = WebSocketService.getInstance();
    const navigate = useNavigate();

    useEffect(() => {
        ws.connect("ws://localhost:8000");

        const handleGameStart = (data: { type: string; color: "white" | "black" }) => {
            if (data.type === "startGame" && data.color) {
                navigate(`/chess-game?color=${data.color}`);
            }
        };

        ws.on("startGame", handleGameStart);

        return () => {
            ws.off("startGame", handleGameStart); 
        };
    }, [ws, navigate]);

    const handlePlay = () => ws.send({ type: "joinGame" });

    return (
        <div className="h-screen flex flex-col bg-green-600 min-w-full min-h-full justify-center">
            <Button onClick={handlePlay}>Play</Button>
            <Button>Spectate</Button>
        </div>
    );
};

export default Home;
