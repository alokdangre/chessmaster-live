import { useEffect, useState } from "react";
import Chessboard from "chessboardjsx";
import { Square } from "chess.js";
import { WebSocketService } from "../services/WebSocketService";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock } from "lucide-react";

export default function ChessGame() {
  const [fen, setFen] = useState("start");
  const [orientation, setOrientation] = useState<"white" | "black">("white");
  const ws = WebSocketService.getInstance();
  const [searchParams] = useSearchParams();
  const [isSpectator, setIsSpectator] = useState(false);
  const navigate = useNavigate();
  const [time] = useState({ white: 600, black: 600 });

  useEffect(() => {
    const color = searchParams.get("color");
    if (color === "black" || color === "white") {
      setOrientation(color as "white" | "black");
    } else {
      setIsSpectator(true);
      if (color) setFen(color);
    }

    if (!ws.isConnected()) {
      console.error("WebSocket is not connected. Redirecting to home...");
      navigate("/");
      return;
    }

    const handleOpponentMove = (data: { type: string; boardState: string }) => {
      setFen(data.boardState);
    };

    const handleGameOver = (data: {
      type: string;
      boardState: string;
      message: string;
      winner: string;
    }) => {
      if (data.type === "gameOver") {
        setFen(data.boardState);
        console.log(data.message);

        if (
          data.winner.toLowerCase() === orientation ||
          data.winner.toLowerCase() === "disconnected"
        ) {
          alert("YOU WIN! Redirecting to home...");
        } else if (data.winner.toLowerCase() === "draw") {
          alert("DRAW! Redirecting to home...");
        } else {
          alert("YOU LOSE! Better luck next time. Redirecting to home...");
        }

        setTimeout(() => navigate("/"), 3000);
      }
    };

    ws.on("updateMove", handleOpponentMove);
    ws.on("gameOver", handleGameOver);

    return () => {
      ws.off("updateMove", handleOpponentMove);
      ws.off("gameOver", handleGameOver);
    };
  }, [orientation, searchParams, ws, navigate]);

  const onDrop = async (data: {
    sourceSquare: Square;
    targetSquare: Square;
  }) => {
    const { sourceSquare, targetSquare } = data;

    const isPawn =
      sourceSquare[0] >= "a" &&
      sourceSquare[0] <= "h" &&
      (sourceSquare[1] === "2" || sourceSquare[1] === "7");

    const isPawnPromotion =
      isPawn &&
      ((sourceSquare[1] === "7" &&
        targetSquare[1] === "8" &&
        orientation === "white") ||
        (sourceSquare[1] === "2" &&
          targetSquare[1] === "1" &&
          orientation === "black"));

    let promotionPiece = null;

    if (isPawnPromotion) {
      promotionPiece = window.prompt("Promote to (q, r, b, n):", "q");
      if (
        promotionPiece === null ||
        !["q", "r", "b", "n"].includes(promotionPiece)
      ) {
        alert("Invalid promotion choice. Valid options are: q, r, b, n.");
        return;
      }
    }

    ws.send({
      type: "makeMove",
      from: sourceSquare,
      to: targetSquare,
      promotion: promotionPiece,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-[#312E2B] text-white flex flex-col">
      <div className="mx-auto w-full max-w-6xl p-4 sm:p-8">
        <div className="mb-4 sm:mb-8 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-white hover:bg-[#3E3B38]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Exit Game
          </Button>
          <div className="text-xl sm:text-2xl font-bold">Chess Arena</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 sm:gap-8">
          <div className="space-y-4">
            <div className="rounded-lg bg-[#272522] p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="font-bold">Player 2</div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  {formatTime(time.black)}
                </div>
              </div>
              <div className="text-sm text-gray-400">Rating: 1500</div>
            </div>
          </div>
          <div className="rounded-lg bg-[#272522] p-4">
            <Chessboard
              width={Math.min(560, window.innerWidth * 0.8)}
              position={fen}
              orientation={orientation}
              draggable={!isSpectator}
              onDrop={onDrop}
              boardStyle={{
                borderRadius: "8px",
              }}
              lightSquareStyle={{ backgroundColor: "#EEEED2" }}
              darkSquareStyle={{ backgroundColor: "#769656" }}
            />
          </div>
          <div className="space-y-4">
            <div className="rounded-lg bg-[#272522] p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="font-bold">Player 1</div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  {formatTime(time.white)}
                </div>
              </div>
              <div className="text-sm text-gray-400">Rating: 1500</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
