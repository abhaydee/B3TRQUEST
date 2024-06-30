import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Connex from "@vechain/connex";

const Home = () => {
  const navigate = useNavigate();

  const [userAddress, setUserAddress] = useState("");
  const [connected, setConnected] = useState(false);
  const [importedData, setImportedData] = useState(null);

  let connex = new Connex({
    node: "https://testnet.veblocks.net/",
    network: "test",
  });

  const contractAddress = "0xFe70A42Fc26a9f659e87134f93465732B360525B"; // Replace with your contract address

  const handleImportedData = (data) => {
    console.log("not yet");
    setImportedData(data);
    console.log("setImportedData", data);
  };

  const connectWallet = async () => {
    console.log("hitting here");
    let connex = new Connex({
      node: "https://testnet.veblocks.net/",
      network: "test",
    });

    try {
      const wallet = await connex.vendor
        .sign("cert", {
          purpose: "identification",
          payload: {
            type: "text",
            content: "please sign this certificate to log in",
          },
        })
        .request();

      if (wallet && wallet.annex) {
        console.log("the wallet", wallet);
        setUserAddress(wallet.annex.signer);
        setConnected(true);
      } else {
        console.error("Wallet object is not as expected:", wallet);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  useEffect(() => {
    console.log("the user address", userAddress);
  }, [userAddress]);

  const handleCardClick = async (cardName) => {
    if (cardName === 'Dog Patch Studios') {
      await createRoomTransaction();
      navigate('/play');
    } else {
      alert('Coming soon');
    }
  };

  const handleClaimClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const realLifeCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
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

  const createRoomTransaction = async () => {
    const contract = connex.thor.account(contractAddress).method({
      "constant": false,
      "inputs": [],
      "name": "createRoom",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    });

    try {
      const tx = await connex.vendor
        .sign('tx', [contract.asClause()])
        .request();

      console.log('Transaction submitted:', tx);
      console.log('Room created successfully');
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row">
      {!connected && (
        <div className="flex-1 flex items-center justify-center p-6">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        </div>
      )}
      {connected && (
        <>
          <div className="flex-1 p-6">
            <h2 className="text-2xl font-bold mb-4">Wallet Address</h2>
            <p className="bg-gray-800 p-4 rounded-lg break-all">{userAddress}</p>
          </div>
          <div className="flex-1 p-6">
            <h1 className="text-3xl font-bold mb-4">Select one</h1>
            <div className="space-y-4">
              <div
                className="bg-gray-800 p-4 rounded-lg flex items-center space-x-4 w-full md:w-96 cursor-pointer"
                onClick={() => handleCardClick('Dog Patch Studios')}
              >
                <img src="dog_patch.jpeg" alt="Dog Patch Studios" className="w-24 h-24 rounded-md object-cover" />
                <span>Dog Patch Studios</span>
              </div>
              <div
                className="bg-gray-800 p-4 rounded-lg flex items-center space-x-4 w-full md:w-96 cursor-pointer"
                onClick={() => handleCardClick('Golden State Park')}
              >
                <img src="../golden_park.webp" alt="Golden State Park" className="w-24 h-24 rounded-md object-cover" />
                <span>Golden State Park</span>
              </div>
              <div
                className="bg-gray-800 p-4 rounded-lg flex items-center space-x-4 w-full md:w-96 cursor-pointer"
                onClick={() => handleCardClick('Pier 39 SF')}
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
        </>
      )}
    </div>
  );
};

export default Home;
