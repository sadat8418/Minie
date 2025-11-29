import React, { useEffect, useState } from "react";
import "./main.css";
function Clock2({ hAngle, mAngle }) {
  const isBlack = hAngle === 225 && mAngle === 225;

  return (
    <svg
      viewBox="0 0 100 100"
      className="clock"
      style={{
        backgroundColor: isBlack ? "black" : "oklch(98% 0.016 73.684)",
        border: isBlack
          ? "1px solid #000"
          : "1px solid oklch(95.4% 0.038 75.164)",
        transition: "background-color 30s ease",  
      }}
    >
      <line
        x1="50"
        y1="10"
        x2="50"
        y2="50"
        stroke="#FF2D00"
        strokeWidth="10"
        style={{
          transformOrigin: "50% 50%",
          transform: `rotate(${hAngle}deg)`,
          transition: "transform 15s ease-in-out",
        }}
      />

      <line
        x1="50"
        y1="20"
        x2="50"
        y2="50"
        stroke="#0050FF"
        strokeWidth="10"
        style={{
          transformOrigin: "50% 50%",
          transform: `rotate(${mAngle}deg)`,
          transition: "transform 15s ease-in-out",
        }}
      />

      <circle cx="50" cy="50" r="5" fill="#FAAB00" />
    </svg>
  );
}


// function Clock({ hAngle, mAngle }) {
//   return (
//     <svg viewBox="0 0 100 100" className="clock">
//       <line
//         x1="50"
//         y1="10"
//         x2="50"
//         y2="50"
//         stroke="#FF2D00"
//         strokeWidth="10"
//         style={{
//           transformOrigin: "50% 50%",
//           transform: `rotate(${hAngle}deg)`,
//           transition: "transform 15s ease-in-out",
//         }}
//       />
//       <line
//         x1="50"
//         y1="20"
//         x2="50"
//         y2="50"
//         stroke="#0050FF"
//         strokeWidth="10"
//         style={{
//           transformOrigin: "50% 50%",
//           transform: `rotate(${mAngle}deg)`,
//           transition: "transform 15s ease-in-out",
//         }}
//       />
//       <circle cx="50" cy="50" r="5" fill="#FAAB00" />
//     </svg>
//   );
// }

// 0° →  up   
// 90° → right  
// 180° → down
// 270° → left  
const DIGITS = {
  0: [
     [180, 90], [270, 90], [270, 180],
    [0, 180], [225, 225], [180, 0],
    [0, 180], [225, 225], [180, 0],
    [0, 90], [90, 270], [270, 0],
  ],
  1: [
    [90, 90], [180, 270], [225, 225],
    [225, 225], [0, 180], [225, 225],
    [225, 225], [0, 180], [225, 225],
    [90, 90], [270, 90], [90, 90],
  ],
  2: [
    [90, 90], [270, 90], [270, 180],
    [90, 180], [270, 90], [270, 0],
    [0, 180], [225, 225], [225, 225],
    [0, 90], [90, 270], [90, 270],
  ],
  3: [
    [90, 90], [270, 90], [270, 180],
    [225, 225], [270, 90], [270, 0],
    [225, 225], [225, 225], [0, 180],
    [90, 90], [90, 270], [0, 270],
  ],
  4: [
    [0, 180], [225, 225], [225, 225],
    [0, 180], [180, 180], [225, 225],
    [0, 90], [270, 90], [270, 90],
    [225, 225], [0, 180], [225, 225],
  ],
  5: [
    [180, 90], [270, 90], [270, 270],
    [90, 0], [270, 90], [270, 180],
    [225, 225], [225, 225], [0, 180],
    [90, 90], [90, 270], [0, 270],
  ],
  6: [
    [180, 90], [270, 90], [270, 270],
    [0, 180],[225, 225], [225, 225],
    [180, 0], [270, 90], [180, 270],
    [0, 90], [90, 270], [0, 270],
  ],
  7: [
    [90, 90], [270, 90], [180, 270],
    [225, 225], [225, 225], [0, 180],
    [225, 225], [225, 225], [0, 180],
     [225, 225],  [225, 225], [0, 180],
  ],
  8: [
    [180, 90], [270, 90], [270, 180],
    [90, 0], [270, 90], [270, 0],
    [180, 90], [270, 90], [270, 180],
    [90, 0], [270, 90], [270, 0],
  ],
  9: [
    [180, 90], [270, 90], [270, 180],
    [90, 0], [270, 90], [270, 0],
     [225, 225], [225, 225], [180, 0],
    [90, 90], [270, 90], [0, 270],
  ],
};

function Digit({ value }) {
  const layout = DIGITS[value] || DIGITS[0];
  return (
    <div className="digit">
      {layout.map(([h, m], i) => (
        <Clock2 key={i} hAngle={h} mAngle={m} />
      ))}
    </div>
  );
}

export default function Clock() {
  const [timeDigits, setTimeDigits] = useState(["0", "0", "0", "0"]);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const hh = now.getHours().toString().padStart(2, "0");
      const mm = now.getMinutes().toString().padStart(2, "0");
      setTimeDigits([...hh, ...mm]);
    };
    update();
    const timer = setInterval(update, 20000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="main">
      {timeDigits.map((n, i) => (
        <Digit key={i} value={parseInt(n)} />
      ))}
    </div>
  );
}
