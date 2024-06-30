import React from 'react';
import logo from '/logo.jpeg'; // Make sure to update the path to your logo image

const Header = ({ connectWallet, handleStravaLogin, connected }) => {
  return (
    <header className="w-full flex justify-between items-center p-6 bg-gray-900 text-white">
      <div className="flex items-center space-x-2">
        <img src={logo} alt="Logo" className="h-24 w-24" /> {/* Adjust height and width as needed */}
        
      </div>
      <div className="flex space-x-4">
        {!connected && (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )}
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleStravaLogin}
        >
          Login with Strava
        </button>
      </div>
    </header>
  );
};

export default Header;
