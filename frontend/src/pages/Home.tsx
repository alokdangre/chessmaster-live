import { useState } from 'react';
import HomeButtons from '../components/HomeButtons';
import WaitingModal from '../components/WaitingModal';

const Home = () => {
  const [waiting, setWaiting] = useState(false);

  const handlePlay = () => {
    setWaiting(true); // Show waiting modal
    // Later: Add logic to request a game and get game ID
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Chess Game</h1>
      <HomeButtons onPlay={handlePlay} />
      {waiting && <WaitingModal />}
    </div>
  );
};

export default Home;
