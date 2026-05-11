import { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { motion, useScroll, useTransform } from 'framer-motion';
import * as THREE from 'three';

/* ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
   3D Scene â stratified earth + cross-sectioned bunker module
   ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ */

function Strata({ mouseRef }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    // gentle continuous rotation
    groupRef.current.rotation.y += delta * 0.06;
    // mouse parallax with lerp
    const tx = (mouseRef.current.y) * 0.15;
    const ty = (mouseRef.current.x) * 0.25;
    groupRef.current.rotation.x += (tx - groupRef.current.rotation.x) * 0.04;
    const baseY = -Math.PI / 12;
    const targetY = baseY + ty;
    // we offset around current; merge gently
    // (keeping rotation.y advancing too â additive feel)
  });

  // 6 strata layers stacked vertically
  const layers = [
    { y: 3.2, h: 0.35, opacity: 0.06 },
    { y: 2.4, h: 0.5,  opacity: 0.08 },
    { y: 1.4, h: 0.6,  opacity: 0.10 },
    { y: 0.2, h: 0.7,  opacity: 0.12 },
    { y: -1.0, h: 0.55, opacity: 0.10 },
    { y: -2.0, h: 0.45, opacity: 0.08 },
  ];

  return (
    <group ref={groupRef} rotation={[0, -Math.PI / 12, 0]}>
      {/* earth strata */}
      {layers.map((l, i) => (
        <group key={i} position={[0, l.y, 0]}>
          {/* solid panel */}
          <mesh>
            <boxGeometry args={[14, l.h, 7]} />
            <meshBasicMaterial color="#8E8E93" transparent opacity={l.opacity} />
          </mesh>
          {/* wireframe */}
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(14, l.h, 7)]} />
            <lineBasicMaterial color="#8E8E93" transparent opacity={0.4} />
          </lineSegments>
        </group>
      ))}

      {/* SURFACE LINE â orange */}
      <group position={[0, 3.6, 0]}>
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(14.4, 0.02, 7.4)]} />
          <lineBasicMaterial color="#FF6B1A" transparent opacity={0.9} />
        </lineSegments>
      </group>

      {/* BUNKER MODULE â horizontal cylinder cross-section */}
      <group position={[0, -3.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        {/* outer shell wireframe */}
        <mesh>
          <cylinderGeometry args={[1.45, 1.45, 6.5, 32, 1, false]} />
          <meshBasicMaterial color="#1A1A1A" transparent opacity={0.7} />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.CylinderGeometry(1.45, 1.45, 6.5, 32, 1, false)]} />
          <lineBasicMaterial color="#B5B5B8" transparent opacity={0.85} />
        </lineSegments>

        {/* inner hollow indicator */}
        <lineSegments>
          <edgesGeometry args={[new THREE.CylinderGeometry(1.2, 1.2, 6.6, 32, 1, true)]} />
          <lineBasicMaterial color="#8E8E93" transparent opacity={0.4} />
        </lineSegments>

        {/* structural rib bands â orange accent */}
        {[-2.2, -0.7, 0.8, 2.2].map((z, i) => (
          <mesh key={i} position={[0, z, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.48, 0.04, 8, 48]} />
            <meshBasicMaterial color="#FF6B1A" transparent opacity={0.9} />
          </mesh>
        ))}

        {/* end caps â accent edges */}
        {[-3.25, 3.25].map((z, i) => (
          <mesh key={i} position={[0, z, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.2, 1.45, 32]} />
            <meshBasicMaterial color="#FF6B1A" transparent opacity={0.5} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>

      {/* VERTICAL ACCESS SHAFT â surface to module */}
      <group position={[1.6, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.18, 0.18, 6.6, 12, 1, true]} />
          <meshBasicMaterial color="#8E8E93" transparent opacity={0.3} wireframe />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.CylinderGeometry(0.18, 0.18, 6.6, 12, 1, false)]} />
          <lineBasicMaterial color="#B5B5B8" transparent opacity={0.6} />
        </lineSegments>
      </group>

      {/* HATCH on top of access shaft */}
      <group position={[1.6, 3.55, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.18, 0.32, 24]} />
          <meshBasicMaterial color="#FF6B1A" transparent opacity={0.9} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* DEPTH MARKER GUIDES â thin vertical lines at edges */}
      {[-6.5, 6.5].map((x, i) => (
        <group key={i}>
          <lineSegments>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([x, 3.6, 3.5, x, -3.3, 3.5])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#FF6B1A" transparent opacity={0.4} />
          </lineSegments>
        </group>
      ))}
    </group>
  );
}

function CameraRig({ scrollProgress }) {
  const { camera } = useThree();
  useFrame(() => {
    // dolly forward + downward as user scrolls
    const p = Math.min(scrollProgress.current, 1);
    camera.position.y = -p * 2.5;
    camera.position.z = 11 - p * 1.5;
    camera.lookAt(0, -p * 1.5, 0);
  });
  return null;
}

function Scene({ mouseRef, scrollProgress }) {
  return (
    <>
      <color attach="background" args={['#1A1A1A']} />
      <fog attach="fog" args={['#1A1A1A', 9, 22]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[6, 8, 5]} intensity={0.6} color="#E8E8E5" />
      <pointLight position={[-3, -4, 4]} intensity={0.3} color="#FF6B1A" />
      <Strata mouseRef={mouseRef} />
      <CameraRig scrollProgress={scrollProgress} />
    </>
  );
}

/* ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
   Hero â overlay + canvas
   ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ */

export default function Hero() {
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollProgress = useRef(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // expose scroll to imperative canvas loop
  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      scrollProgress.current = v;
    });
  }, [scrollYProgress]);

  const overlayY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const handle = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, []);

  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const t = d.toISOString().substring(11, 19);
      setTime(t);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-[110vh] bg-ink overflow-hidden">
      {/* THREE.JS CANVAS BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <Canvas
            camera={{ position: [0, 0, 11], fov: 38 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: false }}
          >
            <Scene mouseRef={mouseRef} scrollProgress={scrollProgress} />
          </Canvas>
        </Suspense>
      </div>

      {/* SCAN LINE â subtle vertical sweep */}
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange/40 to-transparent animate-scan" />
      </div>

      {/* DARKENING VIGNETTE */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-ink/30 via-transparent to-ink/80" />

      {/* CONTENT OVERLAY */}
      <motion.div
        style={{ y: overlayY, opacity: overlayOpacity }}
        className="relative z-20 min-h-screen flex flex-col"
      >
        {/* Top metadata strip */}
        <div className="px-6 md:px-12 pt-32 md:pt-36 grid grid-cols-12 gap-6">
          <div className="col-span-6 md:col-span-3 label text-bone/50">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-orange rounded-full animate-pulse-slow" />
              <span>SYS Â· LIVE</span>
            </div>
            <div className="mt-2 text-bone/30">{time} UTC</div>
          </div>
          <div className="hidden md:block md:col-span-3 label text-bone/50">
            <div className="text-bone/30">SECTION</div>
            <div className="mt-2">N° 01 / Genesis</div>
          </div>
          <div className="hidden md:block md:col-span-3 label text-bone/50">
            <div className="text-bone/30">PROJECT</div>
            <div className="mt-2">MNS-1 / ARCHIVE</div>
          </div>
          <div className="col-span-6 md:col-span-3 label text-bone/50 md:text-right">
            <div className="text-bone/30">COORDINATES</div>
            <div className="mt-2">25.2048° N Â· 55.2708° E</div>
          </div>
        </div>

        {/* Center wordmark */}
        <div className="flex-1 flex items-center px-6 md:px-12">
          <div className="w-full">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="label text-orange mb-6 flex items-center gap-3"
            >
              <span className="w-8 h-px bg-orange" />
              <span>A NEW LAYER OF LIVING</span>
            </motion.div>

            <h1 className="display leading-[0.85] tracking-tighter">
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-[20vw] md:text-[16vw] lg:text-[14vw] text-bone block"
              >
                MINUS
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="text-[20vw] md:text-[16vw] lg:text-[14vw] text-bone block italic -mt-[3vw]"
              >
                <span className="inline-flex items-baseline gap-[2vw]">
                  <span className="w-[8vw] h-[0.8vw] bg-orange inline-block translate-y-[-3vw]" />
                  1
                </span>
              </motion.div>
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-12 grid grid-cols-12 gap-6"
            >
              <div className="col-span-12 md:col-span-5 md:col-start-7">
                <p className="text-bone/80 text-lg md:text-xl leading-relaxed max-w-md">
                  Subterranean residences engineered to military specification, finished to the standard of a private gallery. Built for the era of consequence.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#projects"
                    className="label bg-orange text-ink px-5 py-3 hover:bg-orange-bright transition-colors"
                  >
                    Explore Archetypes â
                  </a>
                  <a
                    href="#contact"
                    className="label border border-bone/30 text-bone px-5 py-3 hover:border-bone hover:bg-bone hover:text-ink transition-all"
                  >
                    Request Access
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom indicator + depth */}
        <div className="px-6 md:px-12 pb-10 grid grid-cols-12 gap-6 items-end">
          <div className="col-span-6 md:col-span-3 label text-bone/50">
            <div className="text-bone/30">SCROLL Â· DESCEND</div>
            <div className="mt-2 flex items-center gap-2">
              <motion.span
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-block"
              >
                ↓
              </motion.span>
              <span>â15.00m</span>
            </div>
          </div>
          <div className="hidden md:block md:col-span-6 text-center">
            <div className="label text-bone/30 mb-2">CROSS-SECTION Â· LIVE RENDER</div>
            <div className="h-px w-24 bg-bone/15 mx-auto" />
          </div>
          <div className="col-span-6 md:col-span-3 label text-bone/50 md:text-right">
            <div className="text-bone/30">TIER</div>
            <div className="mt-2">CLEARANCE I â III</div>
          </div>
        </div>
      </motion.div>

      {/* BOTTOM MARQUEE */}
      <div className="absolute bottom-0 left-0 right-0 z-30 border-t border-bone/10 bg-coal/90 backdrop-blur-sm overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap py-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex shrink-0">
              {[
                'NBC AIR FILTRATION Â· VA-40',
                'BLAST-RATED Â· AR500 STEEL',
                'AUTONOMY Â· 180 DAYS',
                'OVERPRESSURE Â· 50 kPa',
                'DEPTH Â· 15 â 60 m',
                'BIOMETRIC Â· 4FA',
                'POWER Â· OFF-GRID',
                'SIGNATURE Â· BESPOKE',
              ].map((t, j) => (
                <span key={j} className="label text-bone/50 mx-8 flex items-center gap-3">
                  <span className="w-1 h-1 bg-orange rounded-full" />
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
