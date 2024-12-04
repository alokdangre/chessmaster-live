const WaitingModal = () => {
    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-lg text-center">
          <p className="text-lg font-semibold mb-4">Waiting for an opponent...</p>
          <div className="animate-spin h-8 w-8 border-t-4 border-blue-500 rounded-full"></div>
        </div>
      </div>
    );
  };
  
  export default WaitingModal;
  