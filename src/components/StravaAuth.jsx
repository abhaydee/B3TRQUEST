import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StravaAuth = ({ setToken }) => {
  const [authCode, setAuthCode] = useState(null);

  const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=129503&response_type=code&redirect_uri=http://localhost:5173/strava-auth&approval_prompt=auto&scope=read,activity:read`;

  const handleStravaLogin = () => {
    window.location.href = stravaAuthUrl;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code && !authCode) {
      setAuthCode(code);
    }
  }, [authCode]);

  useEffect(() => {
    if (authCode) {
      axios.post('https://www.strava.com/oauth/token', {
        client_id: '129475',
        client_: '91ff1c5ce8b8252426a9194e61b371535f4be114',
        code: authCode,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:5173/strava-auth'
      }).then(response => {
        setToken(response.data.access_token);
        localStorage.setItem('stravaAccessToken', response.data.access_token);
        localStorage.setItem('stravaRefreshToken', response.data.refresh_token);
      }).catch(error => {
        console.error('Error fetching access token:', error);
      });
    }
  }, [authCode, setToken]);

  return (
    <div className="App">
      <h1>Strava OAuth Integration</h1>
      <button onClick={handleStravaLogin}>
        Login with Strava
      </button>
    </div>
  );
};

export default StravaAuth;
