"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ============================================
// الجسيمات المتشابكة الكثيفة
// ============================================
function ParticleField({ count = 2500 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  // توليد المواقع والألوان
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // توزيع كروي ثلاثي الأبعاد
      const radius = 8 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // ألوان ذهبية متدرجة
      const intensity = 0.4 + Math.random() * 0.6;
      colors[i * 3] = 0.75 * intensity;      // R
      colors[i * 3 + 1] = 0.63 * intensity;  // G
      colors[i * 3 + 2] = 0.35 * intensity;  // B

      sizes[i] = 0.05 + Math.random() * 0.15;
    }

    return { positions, colors, sizes };
  }, [count]);

  // الخطوط بين الجسيمات القريبة
  const lineGeometry = useMemo(() => {
    const linePositions: number[] = [];
    const lineColors: number[] = [];
    const maxDist = 2.5;
    const maxConnections = 800;
    let connections = 0;

    for (let i = 0; i < count && connections < maxConnections; i++) {
      const x1 = positions[i * 3];
      const y1 = positions[i * 3 + 1];
      const z1 = positions[i * 3 + 2];

      for (let j = i + 1; j < count && connections < maxConnections; j++) {
        const x2 = positions[j * 3];
        const y2 = positions[j * 3 + 1];
        const z2 = positions[j * 3 + 2];

        const dx = x2 - x1;
        const dy = y2 - y1;
        const dz = z2 - z1;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < maxDist) {
          linePositions.push(x1, y1, z1, x2, y2, z2);

          const opacity = 1 - dist / maxDist;
          const c = 0.4 * opacity;
          lineColors.push(0.75 * c, 0.63 * c, 0.35 * c);
          lineColors.push(0.75 * c, 0.63 * c, 0.35 * c);

          connections++;
        }
      }
    }

    return {
      positions: new Float32Array(linePositions),
      colors: new Float32Array(lineColors),
    };
  }, [positions, count]);

  // الحركة السينمائية
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.04;
      pointsRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.06) * 0.15;
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.04;
      linesRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.06) * 0.15;
    }
  });

  return (
    <group>
      {/* الجسيمات */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={positions.length / 3}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
            count={colors.length / 3}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[sizes, 1]}
            count={sizes.length}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* الخطوط المتشابكة */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[lineGeometry.positions, 3]}
            count={lineGeometry.positions.length / 3}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[lineGeometry.colors, 3]}
            count={lineGeometry.colors.length / 3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

// ============================================
// الكرات المتوهجة الكبيرة (عمق بصري)
// ============================================
function GlowingOrbs() {
  const groupRef = useRef<THREE.Group>(null);

  const orbs = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 8; i++) {
      arr.push({
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
        ] as [number, number, number],
        scale: 0.4 + Math.random() * 0.8,
        speed: 0.2 + Math.random() * 0.4,
        offset: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {orbs.map((orb, i) => (
        <OrbItem key={i} {...orb} />
      ))}
    </group>
  );
}

function OrbItem({
  position,
  scale,
  speed,
  offset,
}: {
  position: [number, number, number];
  scale: number;
  speed: number;
  offset: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime * speed + offset;
      meshRef.current.position.y = position[1] + Math.sin(t) * 0.5;
      const pulse = 1 + Math.sin(t * 2) * 0.1;
      meshRef.current.scale.setScalar(scale * pulse);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshBasicMaterial
        color="#BFA15A"
        transparent
        opacity={0.15}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// ============================================
// كاميرا سينمائية بطيئة
// ============================================
function CinematicCamera() {
  const { camera } = useThree();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    camera.position.x = Math.sin(t * 0.05) * 0.8;
    camera.position.y = Math.cos(t * 0.04) * 0.5;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ============================================
// الخلفية الإجمالية
// ============================================
export default function AmbientBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    >
      {/* الـ Canvas الرئيسي */}
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={0.4} color="#BFA15A" />
          <pointLight position={[-10, -10, -10]} intensity={0.2} color="#536348" />

          <ParticleField count={2000} />
          <GlowingOrbs />
          <CinematicCamera />

          <fog attach="fog" args={["#06070A", 12, 28]} />
        </Suspense>
      </Canvas>

      {/* طبقات تأثير إضافية */}
      <div className="pointer-events-none absolute inset-0">
        {/* توهج مركزي */}
        <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial-glow opacity-30 blur-3xl animate-breathe" />

        {/* Vignette — تظليل الأطراف */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 30%, rgb(6, 7, 10) 100%)",
          }}
        />

        {/* خطوط شبكية رفيعة */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgb(191, 161, 90) 1px, transparent 1px), linear-gradient(90deg, rgb(191, 161, 90) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>
    </div>
  );
}
