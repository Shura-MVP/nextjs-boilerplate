"use client";

interface ShuraLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
}

export default function ShuraLogo({
  size = "md",
  showText = true,
  className = "",
}: ShuraLogoProps) {
  const sizes = {
    sm: { logo: 32, text: "text-lg", subtext: "text-[10px]" },
    md: { logo: 48, text: "text-2xl", subtext: "text-xs" },
    lg: { logo: 72, text: "text-4xl", subtext: "text-sm" },
    xl: { logo: 120, text: "text-6xl", subtext: "text-base" },
  };

  const { logo, text, subtext } = sizes[size];

  const nodeCount = 8;
  const radius = 36;
  const nodes = Array.from({ length: nodeCount }, (_, i) => {
    const angle = (i / nodeCount) * 2 * Math.PI - Math.PI / 2;
    return {
      x: 50 + radius * Math.cos(angle),
      y: 50 + radius * Math.sin(angle),
    };
  });

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width={logo}
        height={logo}
        viewBox="0 0 100 100"
        className="flex-shrink-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="shura-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#BFA15A" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#BFA15A" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Center halo */}
        <circle cx="50" cy="50" r="22" fill="url(#shura-glow)" />

        {/* Deliberation lines: each node to center */}
        {nodes.map((node, i) => (
          <line
            key={`line-c-${i}`}
            x1="50"
            y1="50"
            x2={node.x}
            y2={node.y}
            stroke="#BFA15A"
            strokeWidth="0.5"
            strokeOpacity="0.45"
          />
        ))}

        {/* Consultation arcs: each node to its neighbor */}
        {nodes.map((node, i) => {
          const next = nodes[(i + 1) % nodeCount];
          return (
            <line
              key={`line-n-${i}`}
              x1={node.x}
              y1={node.y}
              x2={next.x}
              y2={next.y}
              stroke="#BFA15A"
              strokeWidth="0.4"
              strokeOpacity="0.3"
            />
          );
        })}

        {/* Outer ring (subtle) */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#BFA15A"
          strokeWidth="0.3"
          strokeOpacity="0.2"
        />

        {/* Agent nodes */}
        {nodes.map((node, i) => (
          <g key={`node-${i}`}>
            <circle
              cx={node.x}
              cy={node.y}
              r="3.6"
              fill="#06070A"
              stroke="#BFA15A"
              strokeWidth="0.9"
            />
            <circle
              cx={node.x}
              cy={node.y}
              r="1.8"
              fill="#BFA15A"
            />
          </g>
        ))}

        {/* Center node — synthesizer */}
        <circle
          cx="50"
          cy="50"
          r="6"
          fill="#06070A"
          stroke="#BFA15A"
          strokeWidth="1.1"
        />
        <circle cx="50" cy="50" r="3" fill="#BFA15A" />
      </svg>

      {showText && (
        <div className="flex flex-col leading-none gap-1">
          <span
            className={`${text} font-bold tracking-wider`}
            style={{ color: "#BFA15A", fontFamily: "var(--font-reem-kufi), 'Reem Kufi', serif" }}
          >
            شــورى
          </span>
          <span
            className={`${subtext} tracking-[0.35em] uppercase font-semibold`}
            style={{ color: "#BFA15A", opacity: 0.65, fontFamily: "var(--font-mono), monospace" }}
          >
            SHURA MAG
          </span>
        </div>
      )}
    </div>
  );
}
