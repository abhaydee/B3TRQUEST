import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Connex from "@vechain/connex";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header';
import LeftSide from './components/LeftSide';
import RightSide from './components/RightSide';

const Home = () => {
  const navigate = useNavigate();

  const [userAddress, setUserAddress] = useState(localStorage.getItem('userAddress') || "");
  const [connected, setConnected] = useState(!!localStorage.getItem('userAddress'));
  const [token, setToken] = useState(localStorage.getItem('stravaAccessToken'));
  const [activities, setActivities] = useState([]);

  let connex = new Connex({
    node: "https://testnet.veblocks.net/",
    network: "test",
  });

  const contractAddress = "0xFe70A42Fc26a9f659e87134f93465732B360525B"; // Replace with your contract address
  const tokenContractAddress = "0x5479c1e1a6Bfee32ae7bCA1875D49e50083EF18D"; // Replace with your token contract address

  const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=129475&response_type=code&redirect_uri=http://localhost:5173/strava-auth&approval_prompt=auto&scope=read,activity:read`;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code && !token) {
      axios.post('https://www.strava.com/oauth/token', {
        client_id: '129475',
        client_secret: '91ff1c5ce8b8252426a9194e61b371535f4be114',
        code,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:5173/strava-auth'
      }).then(response => {
        setToken(response.data.access_token);
        localStorage.setItem('stravaAccessToken', response.data.access_token);
        localStorage.setItem('stravaRefreshToken', response.data.refresh_token);
      }).catch(error => {
        console.error('Error fetching access token:', error);
      });
    } else {
      const storedToken = localStorage.getItem('stravaAccessToken');
      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, [token]);

  useEffect(() => {
    const fetchActivities = () => {
      if (token) {
        axios.get('https://www.strava.com/api/v3/athlete/activities', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).then(response => {
          setActivities(response.data);
          response.data.forEach(activity => {
            console.log('Activity:', activity.name);
            console.log('Distance:', activity.distance, 'meters');
            console.log('Moving Time:', activity.moving_time, 'seconds');
            console.log('Start Date:', activity.start_date);
            console.log('Type:', activity.type);
          });
        }).catch(error => {
          console.error('Error fetching activities:', error);
        });
      }
    };

    // Fetch activities every 30 seconds
    const interval = setInterval(fetchActivities, 30000);
    return () => clearInterval(interval);
  }, [token]);

  const handleStravaLogin = () => {
    window.location.href = stravaAuthUrl;
  };

  const connectWallet = async () => {
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
        setUserAddress(wallet.annex.signer);
        setConnected(true);
        localStorage.setItem('userAddress', wallet.annex.signer);
        toast.success("Wallet connected successfully!");
      } else {
        console.error("Wallet object is not as expected:", wallet);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Error connecting wallet. Please try again.");
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
      toast.info("Coming soon");
    }
  };

  const handleClaimClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const realLifeCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log("Real-life coordinates:", realLifeCoords.lat, realLifeCoords.lng);

        const storedCoords = JSON.parse(localStorage.getItem('gameCoords'));
        if (storedCoords) {
          const storedLat = storedCoords.lat.toFixed(2);
          const storedLng = storedCoords.lng.toFixed(2);
          const realLat = realLifeCoords.lat.toFixed(2);
          const realLng = realLifeCoords.lng.toFixed(2);

          if (storedLat === realLat && storedLng === realLng) {

            await rewardUser();
            toast.success("Hurray You earned 1 B3TR");
            
            // Check the smart contract here
            const contract = connex.thor.account(contractAddress).method({
              "constant": true,
              "inputs": [
                {
                  "internalType": "address",
                  "name": "_user",
                  "type": "address"
                }
              ],
              "name": "getLocation",
              "outputs": [
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            });

            try {
              const result = await contract.call(userAddress);
              const contractLocation = JSON.parse(result.decoded[0]);
              console.log("Location from smart contract:", contractLocation);

              if (contractLocation.lat.toFixed(2) === realLat && contractLocation.lng.toFixed(2) === realLng) {
                
                await rewardUser();
                toast.success("Hurray You earned 1 B3TR");
              } else {
                console.log("False: The coordinates do not match.");
                toast.error("Try some other coordinates");
              }
            } catch (error) {
              console.error('Error fetching location from contract:', error);
            }
          } else {
            console.log("False: The coordinates do not match.");
            toast.error("Try some other coordinates");
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
    const delegateUrl = 'https://sponsor-testnet.vechain.energy/by/280'
    try {
      const tx =  connex.vendor
        .sign('tx', [contract.asClause()])
      const signedTx = await tx.delegate(delegateUrl).request();

      console.log('Transaction submitted:', signedTx);
      console.log('Room created successfully');
    } catch (error) {
      console.error('Error creating room:', error);
      toast.error("Error creating room. Please try again.");
    }
  };

  const rewardUser = async () => {
    const tokenContract = connex.thor.account(tokenContractAddress).method({
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "mint",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    });
  
    // Convert 1 Token to Wei (assuming the token has 18 decimals)
    const amountInWei = '1000000000000000000'; // 1 * 10^18
    const delegateUrl = 'https://sponsor-testnet.vechain.energy/by/280'
    try {
      const tx =  connex.vendor
        .sign('tx', [tokenContract.asClause(userAddress, amountInWei)])
      const signedTx = await tx.delegate(delegateUrl).request();
  
      console.log('Reward transaction submitted:', signedTx);
      toast.success(`Reward transaction submitted. Tx Hash: ${signedTx.txid}`);
    } catch (error) {
      console.error('Error rewarding user:', error);
      toast.error("Error rewarding user. Please try again.");
    }
  };

  const exploreMaps = () => {
    navigate('/maps');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <ToastContainer />
      <Header 
        connectWallet={connectWallet} 
        handleStravaLogin={handleStravaLogin} 
        connected={connected} 
      />
      <div className="flex flex-col md:flex-row">
        {connected && (
          <>
            <LeftSide handleCardClick={handleCardClick} />
            <RightSide 
              handleClaimClick={handleClaimClick} 
              exploreMaps={exploreMaps} 
            />
            {/* <div className="flex-1 p-6">
              <h1 className="text-3xl font-bold mb-4">Strava Activities</h1>
              {!token && (
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleStravaLogin}
                >
                  Login with Strava
                </button>
              )}
              {token && activities.length > 0 && (
                <ul className="space-y-4">
                  {activities.map((activity) => (
                    <li key={activity.id} className="bg-gray-800 p-4 rounded-lg">
                      <h2 className="text-xl font-bold">{activity.name}</h2>
                      <p>Distance: {activity.distance} meters</p>
                      <p>Moving Time: {activity.moving_time} seconds</p>
                      <p>Type: {activity.type}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div> */}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
