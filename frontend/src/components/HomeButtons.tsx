const HomeButtons = ({ onPlay }: { onPlay: () => void }) => {
    return (
      <div className="flex space-x-4">
        <button
          onClick={onPlay}
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Play
        </button>
        <button className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600">
          Spectate
        </button>
        <button className="px-6 py-3 bg-purple-500 text-white rounded hover:bg-purple-600">
          Invite
        </button>
      </div>
    );
  };
  
  export default HomeButtons;
  