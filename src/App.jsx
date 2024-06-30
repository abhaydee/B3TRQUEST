import React  from "react";
import { Routes, Route } from "react-router-dom";
import PlayMe from "./PlayMe";
import Home from "./Home";




function App() {
    return (
        
        <Routes>
          <Route path="/" element={<Home/>} />

          <Route path="/play" element={<PlayMe />} />
          
        </Routes>
       
    );
  }
export default App
