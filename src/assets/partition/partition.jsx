import React, { useState, useCallback, useRef } from "react";
import "./index.css";

const randomColor = () => {
  const r = Math.floor(Math.random() * 200 + 20);
  const g = Math.floor(Math.random() * 200 + 20);
  const b = Math.floor(Math.random() * 200 + 20);
  return `rgb(${r},${g},${b})`;
};

const createLeaf = () => ({
  id: `leaf-${Date.now()}`,
  color: randomColor(),
});

const App = () => {
  const [node, setNode] = useState(createLeaf());

  const containerRef = useRef(null);
  const resizingRef = useRef({ nodeId: null, direction: null });

  const snapValues = useRef(Array.from({ length: 100 }, (_, i) => i + 1)).current;

  const splitNode = useCallback((targetId, direction) => {
    const splitRec = (n) => {
      if (n.children) {
        return { ...n, children: n.children.map(splitRec) };
      }
      if (n.id === targetId) {
        return {
          id: `split-${Date.now()}`,
          direction,
          size: 50,
          children: [n, createLeaf()],
        };
      }
      return n;
    };
    setNode((prev) => splitRec(prev));
  }, []);

  const removeLeaf = useCallback((targetId) => {
    const removeRec = (n) => {
      if (!n.children) return n.id === targetId ? null : n;
      const left = removeRec(n.children[0]);
      const right = removeRec(n.children[1]);
      if (left && right) return { ...n, children: [left, right] };
      return left || right;
    };
    setNode((prev) => removeRec(prev) || createLeaf());
  }, []);

  const startResize = (n, e) => {
    e.preventDefault();
    resizingRef.current = { nodeId: n.id, direction: n.direction };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", stopResize);
  };

  const stopResize = () => {
    resizingRef.current = { nodeId: null, direction: null };
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", stopResize);
  };

  const onMouseMove = (e) => {
    const { nodeId, direction } = resizingRef.current;
    if (!nodeId) return;

    const dom = containerRef.current;
    if (!dom) return;

    const rect = dom.getBoundingClientRect();
    const rel = direction === "vertical"
      ? ((e.clientX - rect.left) / rect.width) * 100
      : ((e.clientY - rect.top) / rect.height) * 100;

    const clamped = Math.max(1, Math.min(99, rel));
    const closest = snapValues.reduce((acc, v) =>
      Math.abs(v - clamped) < Math.abs(acc - clamped) ? v : acc
    , 50);

    setNode((prev) => updateNodeSize(prev, nodeId, closest));
  };

  const updateNodeSize = (n, nodeId, newSize) => {
    if (n.id === nodeId && n.children) {
      return { ...n, size: newSize };
    }
    if (n.children) {
      return { ...n, children: n.children.map(child => updateNodeSize(child, nodeId, newSize)) };
    }
    return n;
  };

  const renderNode = (n) => {
    if (n.children) {
      const isVertical = n.direction === "vertical";
      const containerStyle = {
        display: "flex",
        flexDirection: isVertical ? "row" : "column",
        width: "100%",
        height: "100%",
      };

      const size1 = `${n.size}%`;
      const size2 = `${100 - n.size}%`;

      return (
        <div key={n.id} style={containerStyle}>
          <div style={{ flexBasis: size1, position: "relative" }}>
            {renderNode(n.children[0])}
          </div>
          <div
            style={{
              flexBasis: "10px",
              backgroundColor: "#ccc",
              cursor: isVertical ? "ew-resize" : "ns-resize",
              zIndex: 10,
            }}
            onMouseDown={(e) => startResize(n, e)}
          />
          <div style={{ flexBasis: size2, position: "relative" }}>
            {renderNode(n.children[1])}
          </div>
        </div>
      );
    }

   
    return (
      <div className="partition"
        key={n.id}
        style={{
          backgroundColor: n.color,
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        <div
          style={{
           position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 2,
    display: "flex",
    gap: "8px",
    alignItems: "center",
    justifyContent: "center",
          }}
        >
          <button className="split-btn" onClick={() => splitNode(n.id, "vertical")}>v</button>
          <button className="split-btn" onClick={() => splitNode(n.id, "horizontal")}>h</button>
          <button className="split-btn" onClick={() => removeLeaf(n.id)}>-</button>
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} style={{ width: "100vw", height: "100vh" }}>
      {renderNode(node)}
    </div>
  );
};

export default App;
