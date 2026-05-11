import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Dust({ count = 90 }) {
  const ref = useRef();
  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      velocities[i * 3 + 0] = (Math.random() - 0.5) * 0.003;
      velocities[i * 3 + 1] = -0.004 - Math.random() * 0.008;
      velocities[i * 3 + 2] = 0;
    }
    return { positions, velocities };
  }, [count]);

  useFrame(() => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] += data.velocities[i * 3 + 0];
      pos[i * 3 + 1] += data.velocities[i * 3 + 1];
      if (pos[i * 3 + 1] < -5) {
        pos[i * 3 + 1] = 5;
        pos[i * 3 + 0] = (Math.random() - 0.5) * 18;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={data.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#E8E8E5"
        size={0.04}
        sizeAttenuation
        transparent
        opacity={0.45}
        depthWrite={false}
      />
    </points>
  );
}

export default function DustOverlay() {
  const wrapRef = useRef(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!wrapRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => setVisible(entries[0].isIntersecting),
      { threshold: 0.05 }
    );
    obs.observe(wrapRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.25]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        frameloop={visible ? 'always' : 'never'}
      >
        <Dust />
      </Canvas>
    </div>
  );
}
