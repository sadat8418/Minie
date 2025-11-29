// import React from 'react'
// import {Container, Logo, LogoutBtn} from '../index'
// import { Link } from 'react-router-dom'
// import {useSelector} from 'react-redux'
// import { useNavigate } from 'react-router-dom'
// import { Button } from "@/components/ui/button"

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// import Clock from "../clock/clock.jsx";
// import Relation from "../relation/relation.tsx";
// import  '../relation/relation.css';
function Header() {
  
  
  // const authStatus = useSelector((state) => state.auth.status)
  // const navigate = useNavigate()//#7c89a1
 const projects = [
    { name: "Project One", path: "/p1" },
    { name: "Project Two", path: "/p2" },
    { name: "Project Three", path: "/p3" },
    { name: "Project Four", path: "/p4" },
    { name: "Project Five", path: "/p5" },
  ];

  return (
    <>
    
      
      
        <div class="flex flex-wrap gap-3 p-3 ml-4 mt-4 mb-4 ">

            {projects.map((p, i) => (
          <Link key={i} to={p.path}>

            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              class=" px-6 py-3  rounded-xl bg-white text-black font-bold text-lg shadow-lg  "
            >
              {p.name}
            </motion.button></Link>  ))}
          </div>
          
    
     
        
    
   
    </>
  )
}

export default Header