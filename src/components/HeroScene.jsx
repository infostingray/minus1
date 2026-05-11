import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
   BUNKER MODULE â interactive horizontal cylinder
   ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ */
function BunkerModule({ onHotspot, isVisible }) {
  const groupRef = useRef();
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const lastInteraction = useRef(Date.now());
  const hoveredPart = useRef(null);

  const { gl, camera, raycaster, scene } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;

    const onPointerDown = (e) => {
      isDragging.current = true;
      lastPointer.current = { x: e.clientX, y: e.clientY };
      lastInteraction.current = Date.now();
      canvas.style.cursor = 'grabbing';
    };

    const onPointerMove = (e) => {
      if (isDragging.current) {
        const dx = e.clientX - lastPointer.current.x;
        const dy = e.clientY - lastPointer.current.y;
        targetRotation.current.y += dx * 0.008;
        targetRotation.current.x = Math.max(
          -0.6,
          Math.min(0.6, targetRotation.current.x + dy * 0.006)
        );
        lastPointer.current = { x: e.clientX, y: e.clientY };
        lastInteraction.current = Date.now();
      }
    };

    const onPointerUp = () => {
      isDragging.current = false;
      canvas.style.cursor = 'grab';
    };

    canvas.style.cursor = 'grab';
    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, [gl]);

  useFrame((state) => {
    if (!groupRef.current || !isVisible) return;

    // auto-rotate when idle
    const idle = Date.now() - lastInteraction.current > 2200;
    if (idle && !isDragging.current) {
      targetRotation.current.y += 0.0025;
    }

    // smooth lerp toward target
    currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.08;
    currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.08;
    groupRef.current.rotation.y = currentRotation.current.y;
    groupRef.current.rotation.x = currentRotation.current.x;
  });

  // hover raycasting (sparingly â every other frame)
  const frameCount = useRef(0);
  useFrame(({ pointer }) => {
    frameCount.current++;
    if (frameCount.current % 4 !== 0) return; // throttle
    if (!groupRef.current || isDragging.current) return;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(groupRef.current.children, true);
    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const hotspot = hit.userData?.hotspot;
      if (hotspot && hoveredPart.current !== hotspot) {
        hoveredPart.current = hotspot;
        onHotspot?.(hotspot);
        gl.domElement.style.cursor = 'pointer';
      } else if (!hotspot && hoveredPart.current) {
        hoveredPart.current = null;
        onHotspot?.(null);
        gl.domElement.style.cursor = isDragging.current ? 'grabbing' : 'grab';
      }
    } else if (hoveredPart.current) {
      hoveredPart.current = null;
      onHotspot?.(null);
      gl.domElement.style.cursor = isDragging.current ? 'grabbing' : 'grab';
    }
  });

  // memoize geometry refs for cleanup
  const cylinderGeo = useMemo(() => new THREE.CylinderGeometry(1.15, 1.15, 5, 32, 1, false), []);
  const cylinderEdges = useMemo(() => new THREE.EdgesGeometry(cylinderGeo), [cylinderGeo]);

  return (
    <group ref={groupRef}>
      {/* MAIN CYLINDER BODY */}
      <mesh
        rotation={[0, 0, Math.PI / 2]}
        userData={{ hotspot: { id: 'core', label: 'Living Core', spec: '180-day autonomy' } }}
      >
        <primitive object={cylinderGeo} />
        <meshStandardMaterial color="#2A2A2A" metalness={0.7} roughness={0.45} />
      </mesh>

      {/* WIREFRAME EDGES */}
      <lineSegments rotation={[0, 0, Math.PI / 2]}>
        <primitive object={cylinderEdges} />
        <lineBasicMaterial color="#B5B5B8" transparent opacity={0.5} />
      </lineSegments>

      {/* PANELING â horizontal strips on cylinder */}
      {[-1.8, -0.9, 0, 0.9, 1.8].map((x, i) => (
        <mesh key={`panel-${i}`} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[1.155, 0.008, 4, 48]} />
          <meshBasicMaterial color="#5A5A5A" transparent opacity={0.6} />
        </mesh>
      ))}

      {/* STRUCTURAL RIB BANDS â orange accent */}
      {[-2.1, -0.7, 0.7, 2.1].map((x, i) => (
        <mesh
          key={`rib-${i}`}
          position={[x, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
          userData={{ hotspot: { id: 'ribs', label: 'Structural Ribs', spec: 'AR500 blast frame' } }}
        >
          <torusGeometry args={[1.18, 0.035, 8, 48]} />
          <meshStandardMaterial
            color="#FF6B1A"
            emissive="#FF6B1A"
            emissiveIntensity={0.4}
            metalness={0.3}
            roughness={0.5}
          />
        </mesh>
      ))}

      {/* END CAPS â orange rings */}
      {[-2.6, 2.6].map((x, i) => (
        <mesh key={`cap-${i}`} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <ringGeometry args={[0.85, 1.18, 32]} />
          <meshBasicMaterial color="#FF6B1A" side={THREE.DoubleSide} transparent opacity={0.7} />
        </mesh>
      ))}

      {/* END CAP DOMES (solid) */}
      {[-2.62, 2.62].map((x, i) => (
        <mesh key={`endcap-${i}`} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <circleGeometry args={[0.85, 24]} />
          <meshStandardMaterial color="#1A1A1A" metalness={0.5} roughness={0.6} />
        </mesh>
      ))}

      {/* ACCESS HATCH on top */}
      <group
        position={[0, 1.15, 0]}
        userData={{ hotspot: { id: 'hatch', label: 'Reinforced Hatch', spec: 'AR500 airtight seal' } }}
      >
        <mesh
          userData={{ hotspot: { id: 'hatch', label: 'Reinforced Hatch', spec: 'AR500 airtight seal' } }}
        >
          <cylinderGeometry args={[0.42, 0.42, 0.35, 24]} />
          <meshStandardMaterial color="#3A3A3A" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh
          position={[0, 0.19, 0]}
          userData={{ hotspot: { id: 'hatch', label: 'Reinforced Hatch', spec: 'AR500 airtight seal' } }}
        >
          <torusGeometry args={[0.43, 0.02, 8, 32]} />
          <meshStandardMaterial color="#FF6B1A" emissive="#FF6B1A" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* VERTICAL ACCESS SHAFT */}
      <group
        position={[0, 2.2, 0]}
        userData={{ hotspot: { id: 'shaft', label: 'Access Shaft', spec: '4-factor biometric' } }}
      >
        <mesh
          userData={{ hotspot: { id: 'shaft', label: 'Access Shaft', spec: '4-factor biometric' } }}
        >
          <cylinderGeometry args={[0.18, 0.18, 1.8, 16]} />
          <meshStandardMaterial color="#3A3A3A" metalness={0.6} roughness={0.5} />
        </mesh>
      </group>

      {/* VENT (filtration outlet) â small side cylinder */}
      <group
        position={[1.4, 1.0, 0.6]}
        rotation={[0, 0, Math.PI / 6]}
        userData={{ hotspot: { id: 'vent', label: 'NBC Filtration', spec: 'Swiss VA-40 system' } }}
      >
        <mesh
          userData={{ hotspot: { id: 'vent', label: 'NBC Filtration', spec: 'Swiss VA-40 system' } }}
        >
          <cylinderGeometry args={[0.09, 0.09, 0.5, 12]} />
          <meshStandardMaterial color="#3A3A3A" metalness={0.7} roughness={0.4} />
        </mesh>
        <mesh
          position={[0, 0.27, 0]}
          userData={{ hotspot: { id: 'vent', label: 'NBC Filtration', spec: 'Swiss VA-40 system' } }}
        >
          <cylinderGeometry args={[0.12, 0.09, 0.08, 12]} />
          <meshStandardMaterial color="#FF6B1A" emissive="#FF6B1A" emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* "1" stamp on the side â emissive plate */}
      <mesh position={[0, 0, 1.16]} rotation={[0, 0, 0]}>
        <planeGeometry args={[0.5, 0.5]} />
        <meshBasicMaterial color="#FF6B1A" transparent opacity={0.0} />
      </mesh>

      {/* SHADOW PLANE â fakes a soft contact shadow */}
      <mesh position={[0, -1.6, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={-1}>
        <ringGeometry args={[0, 4, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.4} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
   SCENE
   ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ */
function Scene({ onHotspot, isVisible }) {
  return (
    <>
      <color attach="background" args={['#0F0F0F']} />
      <fog attach="fog" args={['#0F0F0F', 9, 22]} />

      <ambientLight intensity={0.35} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={0.9}
        color="#E8E8E5"
      />
      <directionalLight
        position={[-4, -2, -3]}
        intensity={0.35}
        color="#FF6B1A"
      />
      <pointLight position={[0, 3, 4]} intensity={0.4} color="#E8E8E5" />

      <BunkerModule onHotspot={onHotspot} isVisible={isVisible} />
    </>
  );
}

/* ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
   EXPORT â Canvas wrapper with visibility-paused rendering
   ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ */
export default function HeroScene({ onHotspot }) {
  const wrapRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!wrapRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => setIsVisible(entries[0].isIntersecting),
      { threshold: 0.05 }
    );
    obs.observe(wrapRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="w-full h-full">
      <Canvas
        camera={{ position: [3.8, 1.8, 5.8], fov: 38 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        frameloop={isVisible ? 'always' : 'never'}
      >
        <Scene onHotspot={onHotspot} isVisible={isVisible} />
      </Canvas>
    </div>
  );
}
