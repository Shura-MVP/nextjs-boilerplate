"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Node {
  id: number;
  x: number;
  y: number;
  delay: number;
}

interface Connection {
  from: number;
  to: number;
  delay: number;
}

export default function AgentNetwork() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [activeNode, setActiveNode] = useState<number | null>(null);

  // إنشاء العقد بشكل متناسق دون الكشف عن العدد الفعلي للوكلاء
  const nodes: Node[] = [
    { id: 0, x: 50, y: 50, delay: 0 },
    { id: 1, x: 20, y: 20, delay: 0.1 },
    { id: 2, x: 80, y: 20, delay: 0.15 },
    { id: 3, x: 15, y: 50, delay: 0.2 },
    { id: 4, x: 85, y: 50, delay: 0.25 },
    { id: 5, x: 20, y: 80, delay: 0.3 },
    { id: 6, x: 80, y: 80, delay: 0.35 },
    { id: 7, x: 35, y: 30, delay: 0.4 },
    { id: 8, x: 65, y: 30, delay: 0.45 },
    { id: 9, x: 35, y: 70, delay: 0.5 },
    { id: 10, x: 65, y: 70, delay: 0.55 },
    { id: 11, x: 50, y: 15, delay: 0.6 },
    { id: 12, x: 50, y: 85, delay: 0.65 },
  ];

  // الاتصالات بين العقد — تشكّل نمط متشابك
  const connections: Connection[] = [
    { from: 0, to: 1, delay: 0.5 },
    { from: 0, to: 2, delay: 0.6 },
    { from: 0, to: 7, delay: 0.7 },
    { from: 0, to: 8, delay: 0.8 },
    { from: 0, to: 9, delay: 0.9 },
    { from: 0, to: 10, delay: 1.0 },
    { from: 0, to: 11, delay: 1.1 },
    { from: 0, to: 12, delay: 1.2 },
    { from: 1, to: 3, delay: 1.3 },
    { from: 2, to: 4, delay: 1.4 },
    { from: 3, to: 5, delay: 1.5 },
    { from: 4, to: 6, delay: 1.6 },
    { from: 5, to: 9, delay: 1.7 },
    { from: 6, to: 10, delay: 1.8 },
    { from: 7, to: 11, delay: 1.9 },
    { from: 8, to: 11, delay: 2.0 },
    { from: 9, to: 12, delay: 2.1 },
    { from: 10, to: 12, delay: 2.2 },
    { from: 1, to: 7, delay: 2.3 },
    { from: 2, to: 8, delay: 2.4 },
    { from: 5, to: 3, delay: 2.5 },
    { from: 6, to: 4, delay: 2.6 },
  ];

  // تتبع حجم الحاوية
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  // تنشيط عقدة عشوائية كل فترة
  useEffect(() => {
    const interval = setInterval(() => {
      const randomNode = Math.floor(Math.random() * nodes.length);
      setActiveNode(randomNode);
      
      setTimeout(() => setActiveNode(null), 1500);
    }, 2500);

    return () => clearInterval(interval);
  }, [nodes.length]);

  // تحويل النسب المئوية إلى إحداثيات فعلية
  const getCoord = (percent: number, dimension: number) => 
    (percent / 100) * dimension;

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full"
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* تعريف التدرجات */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(var(--accent))" stopOpacity="0.1" />
            <stop offset="50%" stopColor="rgb(var(--accent))" stopOpacity="0.4" />
            <stop offset="100%" stopColor="rgb(var(--accent))" stopOpacity="0.1" />
          </linearGradient>

          <radialGradient id="nodeGradient">
            <stop offset="0%" stopColor="rgb(var(--accent-soft))" stopOpacity="1" />
            <stop offset="60%" stopColor="rgb(var(--accent))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="rgb(var(--accent))" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="activeNodeGradient">
            <stop offset="0%" stopColor="rgb(var(--accent-soft))" stopOpacity="1" />
            <stop offset="40%" stopColor="rgb(var(--accent))" stopOpacity="0.9" />
            <stop offset="100%" stopColor="rgb(var(--accent))" stopOpacity="0" />
          </radialGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* الخطوط الواصلة */}
        {dimensions.width > 0 && connections.map((conn, idx) => {
          const fromNode = nodes[conn.from];
          const toNode = nodes[conn.to];
          
          return (
            <motion.line
              key={`line-${idx}`}
              x1={getCoord(fromNode.x, dimensions.width)}
              y1={getCoord(fromNode.y, dimensions.height)}
              x2={getCoord(toNode.x, dimensions.width)}
              y2={getCoord(toNode.y, dimensions.height)}
              stroke="url(#lineGradient)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{
                duration: 1.2,
                delay: conn.delay,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* النبضات المتحركة على الخطوط */}
        {dimensions.width > 0 && connections.map((conn, idx) => {
          const fromNode = nodes[conn.from];
          const toNode = nodes[conn.to];
          
          return (
            <motion.circle
              key={`pulse-${idx}`}
              r="2"
              fill="rgb(var(--accent-soft))"
              filter="url(#glow)"
              initial={{ opacity: 0 }}
              animate={{
                cx: [
                  getCoord(fromNode.x, dimensions.width),
                  getCoord(toNode.x, dimensions.width),
                ],
                cy: [
                  getCoord(fromNode.y, dimensions.height),
                  getCoord(toNode.y, dimensions.height),
                ],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 3,
                delay: conn.delay + 2 + idx * 0.3,
                repeat: Infinity,
                repeatDelay: 5 + Math.random() * 3,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* العقد */}
        {dimensions.width > 0 && nodes.map((node) => {
          const isActive = activeNode === node.id;
          const isCenter = node.id === 0;
          
          return (
            <g key={`node-${node.id}`}>
              {/* الهالة الخارجية */}
              <motion.circle
                cx={getCoord(node.x, dimensions.width)}
                cy={getCoord(node.y, dimensions.height)}
                r={isCenter ? 24 : 16}
                fill={isActive ? "url(#activeNodeGradient)" : "url(#nodeGradient)"}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: isActive ? 0.8 : 0.3,
                  scale: isActive ? 1.3 : 1,
                }}
                transition={{
                  duration: 0.6,
                  delay: node.delay,
                  ease: "easeOut",
                }}
              />

              {/* النقطة الرئيسية */}
              <motion.circle
                cx={getCoord(node.x, dimensions.width)}
                cy={getCoord(node.y, dimensions.height)}
                r={isCenter ? 6 : 4}
                fill="rgb(var(--accent))"
                filter="url(#glow)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 1,
                  scale: isActive ? 1.5 : 1,
                }}
                transition={{
                  duration: 0.4,
                  delay: node.delay,
                  ease: "backOut",
                }}
              />

              {/* النبض المستمر للعقدة المركزية */}
              {isCenter && (
                <motion.circle
                  cx={getCoord(node.x, dimensions.width)}
                  cy={getCoord(node.y, dimensions.height)}
                  r={8}
                  fill="none"
                  stroke="rgb(var(--accent))"
                  strokeWidth="1"
                  initial={{ opacity: 0 }}
                  animate={{
                    r: [8, 32],
                    opacity: [0.8, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* تأثير الخلفية المتدرجة */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[rgba(181,136,56,0.03)]" />
    </div>
  );
}
