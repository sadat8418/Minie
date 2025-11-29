import React, { useEffect, useRef, useState } from 'react';
import './relation.css';
type Relation = {
  id: number;
  relation: string;
};

type Person = {
  id: number;
  name: string;
  age: number;
  relations: Relation[];
};

type Position = {
  cx: number;
  cy: number;
};

const defaultText = `
  {
    id: 1,
    name: "রহিম উদ্দিন",
    age: 35,
    relations: [
      { id: 2, relation: "স্বামী" },
      { id: 3, relation: "পিতা" }
    ]
  },
  {
    id: 2,
    name: "সাবিনা আক্তার",
    age: 30,
    relations: [
      { id: 1, relation: "স্ত্রী" },
      { id: 3, relation: "মাতা" }
    ]
  },
  {
    id: 3,
    name: "আফিক রহমান",
    age: 8,
    relations: [
      { id: 1, relation: "ছেলে" },
      { id: 2, relation: "ছেলে" }
    ]
  }
`;

const parseValidPeople = (input: string): Person[] => {
  const objectRegex = /{[^{}]*?(?:{[^{}]*?}[^{}]*?)*}/gs;
  const matches = input.match(objectRegex);
  if (!matches) return [];

  const validPeople: Person[] = [];

  for (let match of matches) {
    try {
      const fixedJson = match
        .replace(/(\w+):/g, '"$1":')
        .replace(/'([^']+)'/g, '"$1"')
        .replace(/,\s*}/g, '}')
        .replace(/,\s*]/g, ']');

      const obj = JSON.parse(fixedJson);

      if (
        typeof obj.id === 'number' &&
        typeof obj.name === 'string' &&
        typeof obj.age === 'number' &&
        Array.isArray(obj.relations) &&
        obj.relations.every(
          (r: any) => typeof r.id === 'number' && typeof r.relation === 'string'
        )
      ) {
        validPeople.push(obj);
      }
    } catch {}
  }

  return validPeople;
};

const canvasWidth = 900;
const canvasHeight = 600;

const Relation = () => {
  const [text, setText] = useState(defaultText.trim());
  const [people, setPeople] = useState<Person[]>([]);
  const [positions, setPositions] = useState<Record<number, Position>>({});
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const validPeople = parseValidPeople(text);
    setPeople(validPeople);

    const newPositions: Record<number, Position> = {};
    const angleStep = (2 * Math.PI) / validPeople.length;
    validPeople.forEach((p, i) => {
      const angle = angleStep * i;
      newPositions[p.id] = {
        cx: canvasWidth / 2 + 200 * Math.cos(angle),
        cy: canvasHeight / 2 + 200 * Math.sin(angle),
      };
    });
    setPositions(newPositions);
  }, [text]);

  const handleMouseDown = (id: number) => (e: React.MouseEvent) => {
    setDraggingId(id);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingId === null || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setPositions((prev) => ({
      ...prev,
      [draggingId]: {
        cx: mouseX,
        cy: mouseY,
      },
    }));
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  const getOffsetLabelPosition = (x1: number, y1: number, x2: number, y2: number, offset: number) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    const offsetX = -dy / length * offset;
    const offsetY = dx / length * offset;
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    return {
      left: { x: midX - offsetX, y: midY - offsetY },
      right: { x: midX + offsetX, y: midY + offsetY },
    };
  };


  const getRadius = (age: number, isHovered: boolean) => {
    const base = 10 + age * 0.8;
    return isHovered ? base * 1.15 : base;
  };

  return (
    <div
      className="flex w-screen main-wrapper overflow-scroll"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        background: 'linear-gradient(135deg, #edf2f7, #cbd5e0)',
        fontFamily: 'sans-serif',
      }}
    >
 
      <div className="left-panel w-1/3  p-4 border-r bg-white shadow-inner">
        <textarea
          className="w-full lg:h-full p-2 text-sm font-mono border rounded "
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div className="right-panel w-1/3  p-4 ">
        <svg
          ref={svgRef}
          width= "900"
          height="600"
                    className="fade-bg"

          style={{
            background: 'linear-gradient(to bottom, #ffffff, #f7fafc)',
            borderRadius: '10px',
            boxShadow: '0 0 8px rgba(0,0,0,0.1)',
          }}
        >
          <defs>
            <radialGradient id="circleGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#bee3f8" />
              <stop offset="100%" stopColor="#63b3ed" />
            </radialGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#aaa" />
            </filter>
          </defs>

         
          {people.flatMap((person) => {
            const from = positions[person.id];
            return person.relations.map((rel, i) => {
              const to = positions[rel.id];
              if (!from || !to) return null;

              const { left } = getOffsetLabelPosition(from.cx, from.cy, to.cx, to.cy, 15);

              return (
                <g key={`${person.id}-${rel.id}-${i}`}>
                  <line
                    x1={from.cx}
                    y1={from.cy}
                    x2={to.cx}
                    y2={to.cy}
                    stroke="#ccc"
                    strokeWidth={2}
                  />
                  <text x={left.x} y={left.y} fontSize={11} textAnchor="middle" fill="#333">
                    {rel.relation}
                  </text>
                </g>
              );
            });
          })}

     
          {people.map((person) => {
            const pos = positions[person.id];
            if (!pos) return null;

            const isHovered = hoveredId === person.id;
            const radius = getRadius(person.age, isHovered);

            return (
              <g
                key={person.id}
                onMouseEnter={() => setHoveredId(person.id)}
                onMouseLeave={() => setHoveredId(null)}
                onMouseDown={handleMouseDown(person.id)}
                style={{ cursor: 'grab' }}
              >
                <circle
                  cx={pos.cx}
                  cy={pos.cy}
                  r={radius}
                  fill="url(#circleGradient)"
                  stroke={isHovered ? '#2c5282' : '#4a5568'}
                  strokeWidth={2}
                  filter="url(#shadow)"
                />
                <text
                  x={pos.cx}
                  y={pos.cy - 10}
                  textAnchor="middle"
                  fontSize={12}
                  fontWeight="bold"
                  fill="#1a202c"
                >
                  {person.name}
                </text>
                <text
                  x={pos.cx}
                  y={pos.cy + 12}
                  textAnchor="middle"
                  fontSize={11}
                  fill="#2d3748"
                >
                  Age {person.age}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default Relation;
