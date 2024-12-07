import React, { useEffect, useState } from "react";
import Chessboard from "chessboardjsx";
import { Square } from "chess.js"; // Keep Square for type safety
import { WebSocketService } from "../services/WebSocketService";
import { useSearchParams } from "react-router-dom";

const ChessGame: React.FC = () => {
  const [fen, setFen] = useState("start");
  const [orientation, setOrientation] = useState<"white" | "black">("white");
  const ws = WebSocketService.getInstance();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const color = searchParams.get("color");
    if (color === "black" || color === "white") {
      setOrientation(color as "white" | "black");
    }

    const handleOpponentMove = (data: { type: string; boardState: string }) => {
      if (data.type === "updateMove") {
        setFen(data.boardState); 
      }
    };
    const handleGameOver = (data: {type: string; boardState: string, message: string,winner: string}) => {
      if(data.type === "gameOver") {
        setFen(data.boardState);
        console.log(data.message);
        if(data.winner.toLowerCase() === orientation || data.winner.toLowerCase() === "disconnected") {
          console.log("YOU WIN!!!!!");
        }
        else if(data.winner.toLowerCase() === "draw") {
          console.log("DRAW");
        }
        else console.log("YOU LOSE, Better luck next time")
      }
    }

    const handleError = (data: {type: string; message: string}) => {
      if(data.type === "error") {
        console.log(data.message);
      }
    }

    ws.on("updateMove", handleOpponentMove);
    ws.on("gameOver", handleGameOver);
    ws.on("error", handleError);

    return () => {
      ws.off("updateMove", handleOpponentMove);
    };
  }, [orientation, searchParams, ws]);

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

    const temporaryFen = `${fen} TEMPORARY MOVE FROM: ${sourceSquare} TO: ${targetSquare}`;
    setFen(temporaryFen);
  };

  return (
    <div className="flex flex-col items-center">
      <Chessboard
        width={400}
        position={fen}
        orientation={orientation}
        draggable
        onDrop={(move) => onDrop(move)}
      />
      <div className="mt-4">
        <p>Player Color: {orientation.charAt(0).toUpperCase() + orientation.slice(1)}</p>
      </div>
    </div>
  );
};

export default ChessGame;
