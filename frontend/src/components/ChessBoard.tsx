import React from 'react';

const ChessBoard = () => {
  // Initial board state with Unicode chess pieces
  const board = [
    ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'], // Black major pieces
    ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'], // Black pawns
    [null, null, null, null, null, null, null, null], // Empty squares
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'], // White pawns
    ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'], // White major pieces
  ];

  const renderSquare = (piece: string | null, index: number) => {
    const isLightSquare = (Math.floor(index / 8) + (index % 8)) % 2 === 0;

    return (
      <div
        key={index}
        className={`w-full h-full flex items-center justify-center text-2xl font-bold ${
          isLightSquare ? 'bg-gray-300' : 'bg-green-600'
        }`}
      >
        {piece}
      </div>
    );
  };

  return (
    <div className="bg-black grid grid-cols-8 grid-rows-8 w-96 h-96">
      {board.flat().map((piece, index) => renderSquare(piece, index))}
    </div>
  );
};

export default ChessBoard;
