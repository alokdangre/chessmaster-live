// import React from 'react';
import ChessBoard from '../components/ChessBoard';

const Game = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Chess Game</h1>
      <ChessBoard />
    </div>
  );
};

export default Game;
