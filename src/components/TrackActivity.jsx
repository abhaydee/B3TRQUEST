import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TrackActivity = ({ token }) => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (token) {
      axios.get('https://www.strava.com/api/v3/athlete/activities', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(response => {
        setActivities(response.data);
      }).catch(error => {
        console.error('Error fetching activities:', error);
      });
    }
  }, [token]);

  return (
    <div className="App">
      <h1>Strava Activities</h1>
      {activities.length === 0 && <p>No activities found</p>}
      <ul>
        {activities.map(activity => (
          <li key={activity.id}>
            {activity.name} - {activity.distance} meters
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrackActivity;
