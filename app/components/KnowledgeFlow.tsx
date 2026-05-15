"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  startY: number;
  duration: number;
  delay: number;
  size: number;
  validated: boolean;
}

export default function KnowledgeFlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);

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

  // توليد الجسيمات بشكل مستمر
  useEffect(() => {
    if (dimensions.width === 0) return;

    let particleId = 0;

    const generateParticle = () => {
      const newParticle: Particle = {
        id: particleId++,
        startY: 10 + Math.random() * 80, // نسبة مئوية
        duration: 4 + Math.random() * 3,
        delay: 0,
        size: 2 + Math.random() * 2,
        validated: Math.random() > 0.3, // 70% تمر، 30% تُرفض
      };

      setParticles((prev) => [...prev, newParticle]);

      // إزالة الجسيم بعد انتهاء حركته
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
      }, (newParticle.duration + 1) * 1000);
    };

    // إنتاج جسيم كل 400ms
    const interval = setInterval(generateParticle, 400);

    // توليد بعض الجسيمات الأولية
    for (let i = 0; i < 5; i++) {
      setTimeout(generateParticle, i * 300);
    }

    return () => clearInterval(interval);
  }, [dimensions.width]);

  // مواقع البوابات (طبقات التحقق)
  const gates = [
    { x: 25, label: "g1" },
    { x: 50, label: "g2" },
    { x: 75, label: "g3" },
  ];

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* تدرج الجسيمات الموثّقة */}
          <radialGradient id="validParticle">
            <stop offset="0%" stopColor="rgb(var(--accent-soft))" stopOpacity="1" />
            <stop offset="50%" stopColor="rgb(var(--accent))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="rgb(var(--accent))" stopOpacity="0" />
          </radialGradient>

          {/* تدرج الجسيمات المرفوضة */}
          <radialGradient id="invalidParticle">
            <stop offset="0%" stopColor="rgb(var(--muted))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="rgb(var(--muted))" stopOpacity="0" />
          </radialGradient>

          {/* تدرج البوابات */}
          <linearGradient id="gateGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgb(var(--primary))" stopOpacity="0" />
            <stop offset="50%" stopColor="rgb(var(--primary))" stopOpacity="0.4" />
            <stop offset="100%" stopColor="rgb(var(--primary))" stopOpacity="0" />
          </linearGradient>

          {/* فلتر التوهج */}
          <filter id="particleGlow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* الخطوط الأفقية الإرشادية (شبكة خفيفة جداً) */}
        {dimensions.width > 0 &&
          [20, 40, 60, 80].map((y) => (
            <line
              key={`grid-${y}`}
              x1="0"
              y1={(y / 100) * dimensions.height}
              x2={dimensions.width}
              y2={(y / 100) * dimensions.height}
              stroke="rgb(var(--border))"
              strokeWidth="0.5"
              strokeDasharray="4 8"
              opacity="0.3"
            />
          ))}

        {/* البوابات (طبقات التحقق) */}
        {dimensions.width > 0 &&
          gates.map((gate, idx) => (
            <g key={`gate-${gate.label}`}>
              {/* خط البوابة الرأسي */}
              <motion.line
                x1={(gate.x / 100) * dimensions.width}
                y1="0"
                x2={(gate.x / 100) * dimensions.width}
                y2={dimensions.height}
                stroke="url(#gateGradient)"
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: idx * 0.3 }}
              />

              {/* نقاط مضيئة على البوابة */}
              <motion.circle
                cx={(gate.x / 100) * dimensions.width}
                cy={dimensions.height * 0.5}
                r="4"
                fill="rgb(var(--primary-soft))"
                filter="url(#particleGlow)"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  r: [3, 5, 3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: idx * 0.5,
                  ease: "easeInOut",
                }}
              />
            </g>
          ))}

        {/* الجسيمات المتدفقة */}
        <AnimatePresence>
          {dimensions.width > 0 &&
            particles.map((particle) => {
              const startX = -20;
              const endX = dimensions.width + 20;
              const y = (particle.startY / 100) * dimensions.height;

              // الجسيمات المرفوضة تتلاشى عند البوابة الثانية
              const rejectionPoint = particle.validated
                ? endX
                : (50 / 100) * dimensions.width;

              return (
                <motion.g key={particle.id}>
                  {/* الذيل الضوئي */}
                  <motion.circle
                    r={particle.size * 2}
                    fill={particle.validated ? "url(#validParticle)" : "url(#invalidParticle)"}
                    initial={{ cx: startX, cy: y, opacity: 0 }}
                    animate={{
                      cx: rejectionPoint,
                      opacity: particle.validated ? [0, 0.6, 0.6, 0] : [0, 0.4, 0],
                    }}
                    transition={{
                      duration: particle.duration,
                      ease: "linear",
                      times: particle.validated ? [0, 0.1, 0.9, 1] : [0, 0.3, 0.5],
                    }}
                  />

                  {/* الجسيم الرئيسي */}
                  <motion.circle
                    r={particle.size}
                    fill={particle.validated ? "rgb(var(--accent))" : "rgb(var(--muted))"}
                    filter="url(#particleGlow)"
                    initial={{ cx: startX, cy: y, opacity: 0 }}
                    animate={{
                      cx: rejectionPoint,
                      opacity: particle.validated ? [0, 1, 1, 0] : [0, 0.7, 0],
                    }}
                    transition={{
                      duration: particle.duration,
                      ease: "linear",
                      times: particle.validated ? [0, 0.1, 0.9, 1] : [0, 0.3, 0.5],
                    }}
                  />

                  {/* تأثير التحقق عند المرور */}
                  {particle.validated && (
                    <>
                      {gates.map((gate, gateIdx) => (
                        <motion.circle
                          key={`flash-${particle.id}-${gateIdx}`}
                          cx={(gate.x / 100) * dimensions.width}
                          cy={y}
                          r="0"
                          fill="rgb(var(--accent-soft))"
                          initial={{ opacity: 0 }}
                          animate={{
                            r: [0, 8, 0],
                            opacity: [0, 0.8, 0],
                          }}
                          transition={{
                            duration: 0.4,
                            delay: particle.duration * (gate.x / 100),
                            ease: "easeOut",
                          }}
                        />
                      ))}
                    </>
                  )}
                </motion.g>
              );
            })}
        </AnimatePresence>

        {/* علامة "موثّق" عند النهاية (مؤشر بصري خفيف) */}
        {dimensions.width > 0 && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <motion.circle
              cx={dimensions.width - 20}
              cy={dimensions.height / 2}
              r="3"
              fill="rgb(var(--accent))"
              animate={{
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.g>
        )}
      </svg>

      {/* طبقة تأثير ضبابي خفيف على الأطراف */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[rgb(var(--background))] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[rgb(var(--background))] to-transparent" />
    </div>
  );
}
