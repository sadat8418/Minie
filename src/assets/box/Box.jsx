import React, { useState, useRef, useEffect } from "react";
// import "./box.css";
const BoxDuplicator = () => {
  const [boxes, setBoxes] = useState([]);
  const [connections, setConnections] = useState([]);
  const containerRef = useRef(null);
  const [draggingBox, setDraggingBox] = useState(null);

  const BOX_SIZE = 120;
  const MAX_TRIES = 50; // attempts to find free space

  // Utility: check overlap
  const isOverlapping = (x, y, allBoxes) => {
    return allBoxes.some(
      (b) => Math.abs(b.x - x) < BOX_SIZE && Math.abs(b.y - y) < BOX_SIZE
    );
  };

  // Generate a random non-overlapping position
  const getRandomPosition = (allBoxes, containerWidth, containerHeight) => {
    for (let i = 0; i < MAX_TRIES; i++) {
      const x = Math.random() * (containerWidth - BOX_SIZE);
      const y = Math.random() * (containerHeight - BOX_SIZE);
      if (!isOverlapping(x, y, allBoxes)) return { x, y };
    }
    // fallback if too crowded
    return { x: 50 + Math.random() * 200, y: 50 + Math.random() * 200 };
  };

  // Initialize first random box on mount
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const { offsetWidth, offsetHeight } = container;
    const randomPos = getRandomPosition([], offsetWidth, offsetHeight);
    setBoxes([{ id: 1, ...randomPos }]);
  }, []);

  // Duplicate box in random free spot
  const duplicateBox = (id) => {
    setBoxes((prev) => {
      const parent = prev.find((b) => b.id === id);
      if (!parent || !containerRef.current) return prev;

      const container = containerRef.current;
      const newId = prev.length ? prev[prev.length - 1].id + 1 : 1;

      const randomSpot = getRandomPosition(
        prev,
        container.offsetWidth,
        container.offsetHeight
      );

      const newBox = { id: newId, x: randomSpot.x, y: randomSpot.y };
      setConnections((prevConn) => [...prevConn, { from: id, to: newId }]);
      return [...prev, newBox];
    });
  };

  // Dragging logic
  const handleDragStart = (id) => setDraggingBox(id);
  const handleDrag = (e) => {
    if (!draggingBox) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - BOX_SIZE / 2;
    const newY = e.clientY - rect.top - BOX_SIZE / 2;
    setBoxes((prev) =>
      prev.map((b) => (b.id === draggingBox ? { ...b, x: newX, y: newY } : b))
    );
  };
  const handleDragEnd = () => setDraggingBox(null);

  // Draw dotted lines
  const renderConnections = () => (
    <svg
      width="100%"
      height="100%"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
      }}
    >
      {connections.map((conn, i) => {
        const fromBox = boxes.find((b) => b.id === conn.from);
        const toBox = boxes.find((b) => b.id === conn.to);
        if (!fromBox || !toBox) return null;

        const x1 = fromBox.x + BOX_SIZE / 2;
        const y1 = fromBox.y + BOX_SIZE / 2;
        const x2 = toBox.x + BOX_SIZE / 2;
        const y2 = toBox.y + BOX_SIZE / 2;

        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#555"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        );
      })}
    </svg>
  );

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleDrag}
      onMouseUp={handleDragEnd}
       
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        background: "#9CA3AF",
        overflow: "hidden",
      }}
    >
      {renderConnections()}
      {boxes.map((box) => (
        <div
          key={box.id}
          onMouseDown={() => handleDragStart(box.id)}
          onMouseUp={handleDragEnd}
          style={{
            position: "absolute",
            top: box.y,
            left: box.x,
            width: BOX_SIZE,
            height: BOX_SIZE,
            backgroundColor: "#4CAF50",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            cursor: "grab",
            userSelect: "none",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          }}
        >
          <div>Box {box.id}</div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              duplicateBox(box.id);
            }}
            style={{
              marginTop: "8px",
              padding: "4px 8px",
              border: "none",
              background: "white",
              color: "#4CAF50",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            Duplicate
          </button>
        </div>
      ))}
    </div>
  );
};

export default BoxDuplicator;
