import { useRef, useEffect, useState, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

const OUTSIDE_IMAGE =
  'https://images.unsplash.com/photo-1547234935-80c7145ec969?w=2400&q=85&auto=format&fit=crop';

/* ──────────────────────────────────────────────────────────────
   CAMERA CONTROLLER — first-person mouse-drag look
   ────────────────────────────────────────────────────────────── */
function CameraController() {
  const { camera, gl } = useThree();
  const target = useRef({ yaw: 0, pitch: 0 });
  const current = useRef({ yaw: 0, pitch: 0 });
  const isDragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const lastInteraction = useRef(Date.now());

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.style.cursor = 'grab';

    const onDown = (e) => {
      isDragging.current = true;
      last.current = { x: e.clientX, y: e.clientY };
      lastInteraction.current = Date.now();
      canvas.style.cursor = 'grabbing';
    };
    const onMove = (e) => {
      if (!isDragging.current) return;
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      target.current.yaw -= dx * 0.004;
      target.current.pitch -= dy * 0.003;
      // clamp
      target.current.yaw = Math.max(-0.55, Math.min(0.55, target.current.yaw));
      target.current.pitch = Math.max(-0.25, Math.min(0.25, target.current.pitch));
      last.current = { x: e.clientX, y: e.clientY };
      lastInteraction.current = Date.now();
    };
    const onUp = () => {
      isDragging.current = false;
      canvas.style.cursor = 'grab';
    };

    canvas.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);

    return () => {
      canvas.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [gl]);

  useFrame((state) => {
    // idle: subtle sway
    const idle = Date.now() - lastInteraction.current > 3000;
    if (idle && !isDragging.current) {
      const t = state.clock.elapsedTime;
      target.current.yaw = Math.sin(t * 0.15) * 0.12;
      target.current.pitch = Math.sin(t * 0.1) * 0.04;
    }
    // lerp current toward target
    current.current.yaw += (target.current.yaw - current.current.yaw) * 0.06;
    current.current.pitch += (target.current.pitch - current.current.pitch) * 0.06;
    camera.rotation.order = 'YXZ';
    camera.rotation.y = current.current.yaw;
    camera.rotation.x = current.current.pitch;
  });

  return null;
}

/* ──────────────────────────────────────────────────────────────
   OUTSIDE VIEW — image loaded into a plane behind the window
   ────────────────────────────────────────────────────────────── */
function OutsideView() {
  const texture = useLoader(THREE.TextureLoader, OUTSIDE_IMAGE);
  texture.colorSpace = THREE.SRGBColorSpace;
  return (
    <group>
      {/* Sky / fallback warm gradient backplate */}
      <mesh position={[0, 1.8, -15]}>
        <planeGeometry args={[30, 14]} />
        <meshBasicMaterial color="#3A2415" />
      </mesh>
      {/* Photo */}
      <mesh position={[0, 1.8, -14.5]}>
        <planeGeometry args={[26, 11]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
}

function FallbackOutside() {
  return (
    <mesh position={[0, 1.8, -15]}>
      <planeGeometry args={[30, 14]} />
      <meshBasicMaterial color="#C57A3A" />
    </mesh>
  );
}

/* ──────────────────────────────────────────────────────────────
   BUNKER ROOM — walls, floor, ceiling, furniture
   ────────────────────────────────────────────────────────────── */
function Room() {
  const concrete = useMemo(
    () => ({ color: '#2A2826', roughness: 0.85, metalness: 0.05 }),
    []
  );
  const concretePolished = useMemo(
    () => ({ color: '#1A1816', roughness: 0.35, metalness: 0.35 }),
    []
  );
  const brass = useMemo(
    () => ({ color: '#A88445', roughness: 0.32, metalness: 0.9 }),
    []
  );
  const fabric = useMemo(
    () => ({ color: '#3A2D24', roughness: 0.9, metalness: 0.02 }),
    []
  );
  const stone = useMemo(
    () => ({ color: '#0F0E0D', roughness: 0.18, metalness: 0.4 }),
    []
  );
  const wood = useMemo(
    () => ({ color: '#4A3526', roughness: 0.6, metalness: 0.1 }),
    []
  );

  return (
    <group>
      {/* FLOOR */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 10]} />
        <meshStandardMaterial {...concretePolished} />
      </mesh>

      {/* CEILING */}
      <mesh position={[0, 3.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 10]} />
        <meshStandardMaterial color="#15140F" roughness={0.9} />
      </mesh>

      {/* BACK WALL (behind camera) */}
      <mesh position={[0, 1.6, 5]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[12, 3.2]} />
        <meshStandardMaterial {...concrete} />
      </mesh>

      {/* LEFT WALL */}
      <mesh position={[-6, 1.6, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[10, 3.2]} />
        <meshStandardMaterial {...concrete} />
      </mesh>

      {/* RIGHT WALL */}
      <mesh position={[6, 1.6, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[10, 3.2]} />
        <meshStandardMaterial {...concrete} />
      </mesh>

      {/* FRONT WALL — 4 pieces around window opening (window: x=-3 to +3, y=1.05 to 2.55) */}
      {/* below window */}
      <mesh position={[0, 0.525, -5]}>
        <planeGeometry args={[12, 1.05]} />
        <meshStandardMaterial {...concrete} />
      </mesh>
      {/* above window */}
      <mesh position={[0, 2.875, -5]}>
        <planeGeometry args={[12, 0.65]} />
        <meshStandardMaterial {...concrete} />
      </mesh>
      {/* left of window */}
      <mesh position={[-4.5, 1.8, -5]}>
        <planeGeometry args={[3, 1.5]} />
        <meshStandardMaterial {...concrete} />
      </mesh>
      {/* right of window */}
      <mesh position={[4.5, 1.8, -5]}>
        <planeGeometry args={[3, 1.5]} />
        <meshStandardMaterial {...concrete} />
      </mesh>

      {/* WINDOW FRAME — brass trim around opening */}
      {/* top */}
      <mesh position={[0, 2.56, -4.99]}>
        <boxGeometry args={[6.2, 0.04, 0.06]} />
        <meshStandardMaterial {...brass} />
      </mesh>
      {/* bottom */}
      <mesh position={[0, 1.04, -4.99]}>
        <boxGeometry args={[6.2, 0.04, 0.06]} />
        <meshStandardMaterial {...brass} />
      </mesh>
      {/* left */}
      <mesh position={[-3.02, 1.8, -4.99]}>
        <boxGeometry args={[0.04, 1.55, 0.06]} />
        <meshStandardMaterial {...brass} />
      </mesh>
      {/* right */}
      <mesh position={[3.02, 1.8, -4.99]}>
        <boxGeometry args={[0.04, 1.55, 0.06]} />
        <meshStandardMaterial {...brass} />
      </mesh>

      {/* COVE LIGHT STRIPS — emissive orange along where walls meet ceiling */}
      <mesh position={[0, 3.15, -4.95]}>
        <boxGeometry args={[12, 0.03, 0.04]} />
        <meshBasicMaterial color="#FF7A28" />
      </mesh>
      <mesh position={[0, 3.15, 4.95]}>
        <boxGeometry args={[12, 0.03, 0.04]} />
        <meshBasicMaterial color="#FF7A28" />
      </mesh>
      <mesh position={[-5.95, 3.15, 0]}>
        <boxGeometry args={[0.04, 0.03, 10]} />
        <meshBasicMaterial color="#FF7A28" />
      </mesh>
      <mesh position={[5.95, 3.15, 0]}>
        <boxGeometry args={[0.04, 0.03, 10]} />
        <meshBasicMaterial color="#FF7A28" />
      </mesh>

      {/* WINDOW GLASS — subtle transparent reflection plane */}
      <mesh position={[0, 1.8, -4.97]}>
        <planeGeometry args={[6, 1.5]} />
        <meshBasicMaterial color="#B0C8D8" transparent opacity={0.04} />
      </mesh>

      {/* ──────────── FURNITURE ──────────── */}
      {/* BANQUETTE — long low seat along left wall */}
      {/* base */}
      <mesh position={[-5.2, 0.3, 0]}>
        <boxGeometry args={[1, 0.6, 3.4]} />
        <meshStandardMaterial {...wood} />
      </mesh>
      {/* cushion */}
      <mesh position={[-5.2, 0.7, 0]}>
        <boxGeometry args={[1, 0.2, 3.4]} />
        <meshStandardMaterial {...fabric} />
      </mesh>
      {/* backrest */}
      <mesh position={[-5.6, 1.2, 0]}>
        <boxGeometry args={[0.2, 0.8, 3.4]} />
        <meshStandardMaterial {...fabric} />
      </mesh>
      {/* brass detail line on banquette */}
      <mesh position={[-5.2, 0.6, 0]}>
        <boxGeometry args={[1.01, 0.015, 3.42]} />
        <meshStandardMaterial {...brass} />
      </mesh>

      {/* COFFEE TABLE — low stone slab */}
      <mesh position={[-3.8, 0.32, 0]}>
        <boxGeometry args={[1.4, 0.06, 1.8]} />
        <meshStandardMaterial {...stone} />
      </mesh>
      {/* pedestal under table */}
      <mesh position={[-3.8, 0.16, 0]}>
        <boxGeometry args={[0.5, 0.3, 0.6]} />
        <meshStandardMaterial color="#1F1D1A" roughness={0.5} metalness={0.5} />
      </mesh>
      {/* small brass object on coffee table */}
      <mesh position={[-3.8, 0.5, 0.3]}>
        <cylinderGeometry args={[0.08, 0.12, 0.3, 12]} />
        <meshStandardMaterial {...brass} />
      </mesh>
      <mesh position={[-3.8, 0.45, -0.4]}>
        <boxGeometry args={[0.3, 0.15, 0.4]} />
        <meshStandardMaterial color="#2A2422" roughness={0.7} />
      </mesh>

      {/* SCULPTURE PEDESTAL — right side */}
      <mesh position={[4.5, 0.5, 1]}>
        <cylinderGeometry args={[0.22, 0.25, 1, 24]} />
        <meshStandardMaterial color="#1F1D1A" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* sculpture on top — abstract brass form */}
      <mesh position={[4.5, 1.2, 1]} rotation={[0.3, 0.5, 0.2]}>
        <torusKnotGeometry args={[0.18, 0.06, 64, 8]} />
        <meshStandardMaterial {...brass} />
      </mesh>

      {/* BOOKSHELF along right wall */}
      <group position={[5.4, 0, -1.5]}>
        {/* frame */}
        <mesh position={[0, 1.1, 0]}>
          <boxGeometry args={[0.8, 2.2, 2]} />
          <meshStandardMaterial color="#0F0E0D" roughness={0.5} metalness={0.3} />
        </mesh>
        {/* shelves — thin brass strips */}
        {[0.4, 0.85, 1.3, 1.75].map((y, i) => (
          <mesh key={i} position={[-0.3, y, 0]}>
            <boxGeometry args={[0.42, 0.02, 2.02]} />
            <meshStandardMaterial {...brass} />
          </mesh>
        ))}
        {/* books — vertical thin boxes */}
        {Array.from({ length: 22 }).map((_, i) => {
          const row = Math.floor(i / 6);
          const col = i % 6;
          const y = 0.55 + row * 0.45;
          const z = -0.85 + col * 0.3;
          const h = 0.32 + Math.random() * 0.08;
          const colors = ['#3A2820', '#1F1A14', '#2A1F18', '#4A3520', '#1A1814'];
          return (
            <mesh key={i} position={[-0.3, y, z]} rotation={[0, 0, (Math.random() - 0.5) * 0.05]}>
              <boxGeometry args={[0.3, h, 0.05]} />
              <meshStandardMaterial color={colors[i % colors.length]} roughness={0.7} />
            </mesh>
          );
        })}
      </group>

      {/* FLOOR LAMP near banquette */}
      <group position={[-4.8, 0, 2]}>
        <mesh position={[0, 1.0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 2, 8]} />
          <meshStandardMaterial {...brass} />
        </mesh>
        <mesh position={[0, 2.05, 0]}>
          <coneGeometry args={[0.18, 0.25, 16, 1, true]} />
          <meshStandardMaterial {...brass} side={THREE.DoubleSide} />
        </mesh>
        {/* warm glow inside the cone */}
        <pointLight position={[0, 1.95, 0]} intensity={0.7} color="#FFB070" distance={3.5} />
      </group>

      {/* PEDESTAL LIGHT near sculpture */}
      <pointLight position={[4.5, 2.5, 1]} intensity={0.5} color="#FFC080" distance={4} />

      {/* RUG — large dark area under coffee table */}
      <mesh position={[-3.8, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.5, 4]} />
        <meshStandardMaterial color="#1A1614" roughness={1} />
      </mesh>

      {/* FLOOR INLAY — thin brass line in front of window */}
      <mesh position={[0, 0.006, -3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 0.02]} />
        <meshBasicMaterial color="#A88445" />
      </mesh>

      {/* TINY "MINUS 1" PLAQUE on wall */}
      <mesh position={[0, 0.85, -4.97]}>
        <planeGeometry args={[0.4, 0.12]} />
        <meshBasicMaterial color="#A88445" />
      </mesh>
    </group>
  );
}

/* ──────────────────────────────────────────────────────────────
   SCENE
   ────────────────────────────────────────────────────────────── */
function Scene() {
  return (
    <>
      <color attach="background" args={['#0F0E0C']} />
      <fog attach="fog" args={['#0F0E0C', 8, 18]} />

      {/* main ambient + hemi for soft fill */}
      <ambientLight intensity={0.25} />
      <hemisphereLight args={['#6B7A88', '#3A2818', 0.4]} />

      {/* cool light coming through the window — simulates outside daylight */}
      <directionalLight
        position={[0, 2, -10]}
        intensity={1.1}
        color="#C8D4E0"
      />

      {/* warm key light from cove — overall warm wash */}
      <pointLight position={[0, 2.9, 0]} intensity={0.6} color="#FF8A40" distance={9} />
      <pointLight position={[-3.5, 2.9, 2]} intensity={0.5} color="#FFA060" distance={6} />
      <pointLight position={[3.5, 2.9, -2]} intensity={0.5} color="#FFA060" distance={6} />

      <Suspense fallback={<FallbackOutside />}>
        <OutsideView />
      </Suspense>

      <Room />
      <CameraController />
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
   EXPORT
   ────────────────────────────────────────────────────────────── */
export default function BunkerInterior() {
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
        camera={{ position: [0, 1.6, 2.5], fov: 60, near: 0.1, far: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        frameloop={visible ? 'always' : 'never'}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
