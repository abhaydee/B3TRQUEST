import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate('/play');
  };

  const handleClaimClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const realLifeCoords = {
          lat: position.coords.latitude, // use latitude as x-coordinate
          lng: position.coords.longitude, // use longitude as z-coordinate
        };
        console.log("Real-life coordinates:", realLifeCoords.lat, realLifeCoords.lng);

        const storedCoords = JSON.parse(localStorage.getItem('gameCoords'));
        if (storedCoords) {
          const storedLat = storedCoords.lat.toFixed(6);
          const storedLng = storedCoords.lng.toFixed(6);
          const realLat = realLifeCoords.lat.toFixed(6);
          const realLng = realLifeCoords.lng.toFixed(6);

          if (storedLat === realLat && storedLng === realLng) {
            console.log("True: The coordinates match.");
          } else {
            console.log("False: The coordinates do not match.");
          }
        } else {
          console.log("No game coordinates found in local storage.");
        }
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row">
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-4">Select one</h1>
        <div className="space-y-4">
          <div
            className="bg-gray-800 p-4 rounded-lg flex items-center space-x-4 w-full md:w-96 cursor-pointer"
            onClick={handleCardClick}
          >
            <img src="dog_patch.jpeg" alt="Dog Patch Studios" className="w-24 h-24 rounded-md object-cover" />
            <span>Dog Patch Studios</span>
          </div>
          <div
            className="bg-gray-800 p-4 rounded-lg flex items-center space-x-4 w-full md:w-96 cursor-pointer"
            onClick={handleCardClick}
          >
            <img src="../golden_park.webp" alt="Golden State Park" className="w-24 h-24 rounded-md object-cover" />
            <span>Golden State Park</span>
          </div>
          <div
            className="bg-gray-800 p-4 rounded-lg flex items-center space-x-4 w-full md:w-96 cursor-pointer"
            onClick={handleCardClick}
          >
            <img src="pier_39.jpg" alt="Pier 39 SF" className="w-24 h-24 rounded-md object-cover" />
            <span>Pier 39 SF</span>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleClaimClick}
        >
          Click to claim
        </button>
      </div>
    </div>
  );
};

export default Home;
