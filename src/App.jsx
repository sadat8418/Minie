import { Outlet } from 'react-router-dom'

// import { Header } from "../../../react/12MegaBlogCopy/src/components/index.js";
// import AnimatedClock from "./assets/animated-clock/animated-clock.jsx";

import { motion } from "framer-motion";
import { Link, Routes, Route } from "react-router-dom";

import Clock from "./assets/clock/clock.jsx";
// import AnimatedClock from "./assets/animated-clock/animated-clock.jsx";
import Relation from "./assets/relation/relation.tsx";
import Partition from "./assets/partition/partition.jsx";
import Video from "./assets/video/video.jsx";
// import './App.css'
import './main-tail.css'
import Header from './assets/header/Header.jsx';
import Box from './assets/box/Box.jsx';
export default function App() {
 
  return (
    <>
     <div className=' bg-gray-400'>
      <div>
        <Header />
      </div>
</div>
      {/* ROUTES */}
       <Routes>
        <Route path="/p1" element={<Clock />} />
       <Route path="/p2" element={<Relation />} />
       <Route path="/p3" element={<Partition />} />
       <Route path="/p4" element={<Video />} />
       <Route path="/p5" element={<Box />} />
        {/* <Route path="/p2" element={<AnimatedClock />} /> */}
      </Routes>
    </>
  );
}
