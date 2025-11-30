
import { Routes, Route } from "react-router-dom";
import Relation from "./assets/relation/relation.tsx";
import Box from './assets/box/Box.jsx';

import Partition from "./assets/partition/partition.jsx";
import Video from "./assets/video/video.js";

import Clock from "./assets/clock/clock.jsx";
import Header from './assets/header/header.jsx';

import './index.css'

export default function App() {
 
  return (
    <>
    <div className=' bg-gray-400'>
        <Header />
    </div>
     
       <Routes>
        <Route path="/p1" element={<Clock />} />
       <Route path="/p2" element={<Relation />} />
       <Route path="/p3" element={<Partition />} />
       <Route path="/p4" element={<Video />} />
       <Route path="/p5" element={<Box />} />
      </Routes>
       
    </>
  );
}
