import { Outlet } from 'react-router-dom'

// import { Header } from "../../../react/12MegaBlogCopy/src/components/index.js";
// import AnimatedClock from "./assets/animated-clock/animated-clock.jsx";

import { motion } from "framer-motion";
import { Link, Routes, Route } from "react-router-dom";

import Clock from "./assets/clock/clock.jsx";
// import AnimatedClock from "./assets/animated-clock/animated-clock.jsx";
import Relation from "./assets/relation/relation.tsx";
// import './App.css'
import './main-tail.css'
import Header from './assets/header/Header.jsx';
export default function App() {
 
  return (
    <>
     <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
      <div className='w-full block'>
        <Header />
        {projects.map((p, i) => (
          <Link key={i} to={p.path}>

            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              class="inline-flex px-6 py-3 rounded-xl bg-white text-black font-bold text-lg shadow-lg  "
            >
              {p.name}
            </motion.button>
          </Link>
          
       
        
        ))}
      </div>
</div>
      {/* ROUTES */}
      <Routes>
        <Route path="/p1" element={<Clock />} />
       <Route path="/p2" element={<Relation />} />
        {/* <Route path="/p2" element={<AnimatedClock />} /> */}
      </Routes>
    </>
  );
}

//   return (
//     <>
//       <div className='min-h-screen flex flex-wrap content-between bg-gray-200'>
//       <div className='w-full block'>
      
       
//          <Header />
//          <main>
//           <Outlet/>
//          </main>
        
//         </div>
//         </div>
//     </>
//   );
// }
