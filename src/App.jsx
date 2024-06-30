import React  from "react";
import { Routes, Route } from "react-router-dom";
import PlayMe from "./PlayMe";
import Home from "./Home";
import Maps from "./Maps";




function App() {
    return (
        
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/strava-auth" element={<Home />} />

          <Route path="/play" element={<PlayMe />} />

          <Route path="/maps" element={<Maps/>}  />
          
        </Routes>
       
    );
  }
export default App
