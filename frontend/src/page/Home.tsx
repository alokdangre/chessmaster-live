import { Button } from "@/components/ui/button";
import { WebSocketService } from "../services/WebSocketService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const ws = WebSocketService.getInstance();
  const navigate = useNavigate();
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    ws.connect("ws://localhost:8000");

    const handleGameStart = (data: { type: string; color: "white" | "black" }) => {
      if (data.type === "startGame" && data.color) {
        navigate(`/chess-game?color=${data.color}`);
      }
    };

    const handleSpectate = (data: {type: string; boardState: string; }) => {
        if (data.type === "spectateGame") {
            navigate(`/chess-game?color=${data.boardState}`)
        }
    }

    ws.on("startGame", handleGameStart);
    ws.on("spectateGame", handleSpectate);

    return () => {
      ws.off("startGame", handleGameStart);
    };
  }, [ws, navigate]);

  const handlePlay = () => {
    ws.send({ type: "joinGame" });
    setIsWaiting(true);
  };

  const handleSpectate = () => ws.send({ type: "spectate" });

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
      <h1 className="text-4xl font-bold mb-8">Welcome to Chess Arena</h1>
      <div className="flex flex-col gap-4 w-1/3">
        <Button
          onClick={handlePlay}
          disabled={isWaiting}
          className={`w-full py-3 rounded-md ${
            isWaiting ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isWaiting ? "Waiting for Opponent..." : "Play"}
        </Button>
        <Button
          onClick={handleSpectate}
          className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 rounded-md"
        >
          Spectate
        </Button>
      </div>
    </div>
  );
};

export default Home;
