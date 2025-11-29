import React, { useRef, useState, useEffect } from "react";
import  video from './demo.mp4';

const size = 360;
const strokeWidth = 44; // thick outer border
const innerPadding = strokeWidth / 1.5;
const borderRadius = 45; // perfect radius
const orangeLineLength = 40;
const sampleSteps = 300;

function roundedRectPath(x: number, y: number, w: number, h: number, r: number) {
  return [
    `M ${x + r} ${y}`,
    `H ${x + w - r}`,
    `A ${r} ${r} 0 0 1 ${x + w} ${y + r}`,
    `V ${y + h - r}`,
    `A ${r} ${r} 0 0 1 ${x + w - r} ${y + h}`,
    `H ${x + r}`,
    `A ${r} ${r} 0 0 1 ${x} ${y + h - r}`,
    `V ${y + r}`,
    `A ${r} ${r} 0 0 1 ${x + r} ${y}`,
    "Z",
  ].join(" ");
}

const VideoRoundedSeek: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);

  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pathLen, setPathLen] = useState(1);
  const [seekerPos, setSeekerPos] = useState<{ x: number; y: number; angle: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);

  const innerSize = size - innerPadding * 2;
  const pathD = roundedRectPath(innerPadding, innerPadding, innerSize, innerSize, borderRadius);

  useEffect(() => {
    if (!pathRef.current) return;
    const len = pathRef.current.getTotalLength();
    setPathLen(len);
  }, []);

  // track video progress
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onUpdate = () => {
      const p = v.currentTime / (v.duration || 1);
      setProgress(isNaN(p) ? 0 : p);
    };
    v.addEventListener("timeupdate", onUpdate);
    v.addEventListener("loadedmetadata", onUpdate);
    return () => {
      v.removeEventListener("timeupdate", onUpdate);
      v.removeEventListener("loadedmetadata", onUpdate);
    };
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) v.pause();
    else v.play();
    setIsPlaying(!isPlaying);
  };

  const findClosestPointOnPath = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    const path = pathRef.current;
    if (!svg || !path) return { p: 0, x: 0, y: 0, angle: 0 };

    const rect = svg.getBoundingClientRect();
    const px = clientX - rect.left;
    const py = clientY - rect.top;

    let bestLen = 0;
    let bestDist = Infinity;
    for (let i = 0; i <= sampleSteps; i++) {
      const l = (i / sampleSteps) * pathLen;
      const pt = path.getPointAtLength(l);
      const dx = pt.x - px;
      const dy = pt.y - py;
      const d2 = dx * dx + dy * dy;
      if (d2 < bestDist) {
        bestDist = d2;
        bestLen = l;
      }
    }

    const pt = path.getPointAtLength(bestLen);
    const p1 = path.getPointAtLength(Math.max(0, bestLen - 1));
    const p2 = path.getPointAtLength(Math.min(pathLen, bestLen + 1));
    const angle = (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;
    return { p: bestLen / pathLen, x: pt.x, y: pt.y, angle };
  };

  const seekToNormalized = (p: number) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const clamped = Math.max(0, Math.min(1, p));
    v.currentTime = clamped * v.duration;
    setProgress(clamped);
  };

  const handleSeekClick = (e: React.PointerEvent<SVGSVGElement>) => {
    const res = findClosestPointOnPath(e.clientX, e.clientY);
    seekToNormalized(res.p);
    setSeekerPos({ x: res.x, y: res.y, angle: res.angle });
  };

  const handleDrag = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    const res = findClosestPointOnPath(e.clientX, e.clientY);
    seekToNormalized(res.p);
    setSeekerPos({ x: res.x, y: res.y, angle: res.angle });
  };

  const stopDrag = () => setIsDragging(false);

  return (
    <div
      className="flex justify-center items-center h-screen bg-gray-400"
    >
      <div
        style={{ position: "relative", width: size, height: size }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <svg
          ref={svgRef}
          width={size}
          height={size}
          style={{ position: "absolute", left: 0, top: 0 }}
          onPointerDown={(e) => {
            setIsDragging(true);
            handleSeekClick(e);
          }}
          onPointerMove={handleDrag}
          onPointerUp={stopDrag}
        >
          {/* Gray background border */}
          <path
            d={pathD}
            fill="none"
            stroke="#d1d5db"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Red progress border */}
          <path
            ref={pathRef}
            d={pathD}
            fill="none"
            stroke="red"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={pathLen}
            strokeDashoffset={Math.max(0, pathLen * (1 - progress))}
            style={{ transition: "stroke-dashoffset 0.1s linear" }}
          />
        </svg>

        {/* Video */}
        <video
          ref={videoRef}
          src={video}
          style={{
            position: "absolute",
            left: innerPadding + strokeWidth * 0.49,
            top: innerPadding + strokeWidth * 0.47,
            width: innerSize - strokeWidth * 0.93,
            height: innerSize - strokeWidth * 0.93,
            objectFit: "cover",
            borderRadius: "25px",
            cursor: "pointer",
          }}
          onClick={togglePlay}
        />

        {/* Transparent Play/Pause – visible only on hover */}
        {hovered && (
          <button
            onClick={togglePlay}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              border: "none",
              background: "transparent",
              color: "rgba(255,255,255,0.8)",
              fontSize: 48,
              opacity: 0.85,
              cursor: "pointer",
              transition: "opacity 0.2s ease",
            }}
          >
            {isPlaying ? "❚❚" : "▶"}
          </button>
        )}

        {/* Orange seeker (fixed until user clicks) */}
        {seekerPos && (
          <svg
            width={size}
            height={size}
            style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
          >
            <g transform={`translate(${seekerPos.x}, ${seekerPos.y}) rotate(${seekerPos.angle})`}>
              <rect
                x={-orangeLineLength / 8}
                y={-orangeLineLength / 2}
                width={orangeLineLength / 4}
                height={orangeLineLength}
                rx={2}
                fill="orange"
                style={{
                  filter: "drop-shadow(0 0 6px rgba(255,165,0,0.9))",
                }}
              />
            </g>
          </svg>
        )}
      </div>
    </div>
  );
};

export default VideoRoundedSeek;
