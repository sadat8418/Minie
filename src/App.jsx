
import { Routes, Route } from "react-router-dom";

import Clock from "./assets/clock/Clock.jsx";
import Relation from "./assets/relation/Relation.tsx";
import Partition from "./assets/partition/Partition.jsx";
import Video from "./assets/video/Video.js";
import Header from './assets/header/Header.jsx';
import Box from './assets/box/Box.jsx';
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
