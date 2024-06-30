import React from 'react';

const RightSide = ({ handleClaimClick, exploreMaps }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleClaimClick}
      >
        Start hunting B3TR
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={exploreMaps}
      >
        Explore Maps
      </button>
    </div>
  );
};

export default RightSide;
