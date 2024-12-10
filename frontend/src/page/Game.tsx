import React, { useEffect, useState } from "react";
import Chessboard from "chessboardjsx";
import { Square } from "chess.js";
import { WebSocketService } from "../services/WebSocketService";
import { useSearchParams, useNavigate } from "react-router-dom";

const ChessGame: React.FC = () => {
  const [fen, setFen] = useState("start");
  const [orientation, setOrientation] = useState<"white" | "black">("white");
  const ws = WebSocketService.getInstance();
  const [searchParams] = useSearchParams();
  const [isSpectator, setIsSpectator] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const color = searchParams.get("color");
    if (color === "black" || color === "white") {
      setOrientation(color as "white" | "black");
    }
    else {
      setIsSpectator(true);;
      if(color) setFen(color);
    }

    if (!ws.isConnected()) {
      console.error("WebSocket is not connected. Redirecting to home...");
      navigate("/");
      return;
    }

    const handleOpponentMove = (data: { type: string; boardState: string }) => {
      if (data.type === "updateMove") {
        setFen(data.boardState);
      }
    };

    const handleGameOver = (data: { type: string; boardState: string; message: string; winner: string }) => {
      if (data.type === "gameOver") {
        setFen(data.boardState);
        console.log(data.message);

        if (data.winner.toLowerCase() === orientation || data.winner.toLowerCase() === "disconnected") {
          alert("YOU WIN! Redirecting to home...");
        } else if (data.winner.toLowerCase() === "draw") {
          alert("DRAW! Redirecting to home...");
        } else {
          alert("YOU LOSE! Better luck next time. Redirecting to home...");
        }

        setTimeout(() => navigate("/"), 3000);
      }
    };

    const handleError = (data: { type: string; message: string }) => {
      if (data.type === "error") {
        console.error(data.message);
        alert(`Error: ${data.message}`);
      }
    };

    ws.on("updateMove", handleOpponentMove);
    ws.on("gameOver", handleGameOver);
    ws.on("error", handleError);

    return () => {
      ws.off("updateMove", handleOpponentMove);
      ws.off("gameOver", handleGameOver);
      ws.off("error", handleError);
    };
  }, [orientation, searchParams, ws, navigate]);

  const onDrop = ({
    sourceSquare,
    targetSquare,
  }: {
    sourceSquare: Square;
    targetSquare: Square;
  }) => {
    console.log("Attempting move:", { from: sourceSquare, to: targetSquare });

    ws.send({
      type: "makeMove",
      from: sourceSquare,
      to: targetSquare,
    });

    setFen(`${fen} TEMPORARY MOVE FROM: ${sourceSquare} TO: ${targetSquare}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
      <h1 className="text-4xl font-bold mb-6">Chess Game</h1>
      <Chessboard
        width={400}
        position={fen}
        orientation={orientation}
        draggable={!isSpectator}
        onDrop={(move) => onDrop(move)}
        boardStyle={{
          borderRadius: "12px",
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.4)",
        }}
      />
      <div className="mt-6 text-lg font-medium">
        Player Color: <span className="capitalize">{orientation}</span>
      </div>
      <button
        onClick={() => navigate("/")}
        className="mt-6 px-6 py-2 bg-red-500 hover:bg-red-600 rounded shadow-md text-white font-medium"
      >
        Exit Game
      </button>
    </div>
  );
};

export default ChessGame;
