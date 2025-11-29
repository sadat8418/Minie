import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// import './App.css'
import App from './App.jsx'
// const router = BrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     children: [
//         {
//             path: "/",
//             element: <Home />,
//         },

//           ],
// },
// ])
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
   <React.StrictMode>
    <App />
    </React.StrictMode>
  </BrowserRouter>
)



