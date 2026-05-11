import { useRef, useEffect, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import * as THREE from 'three';
import Magnetic from './Magnetic';

/* ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
   DUST PARTICLES â drifting downward through the frame
   ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ */
function Dust({ count = 250, mouseRef }) {
  const ref = useRef();
  const velRef = useRef();

  const { positions, velocities, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      velocities[i * 3 + 0] = (Math.random() - 0.5) * 0.002;
      velocities[i * 3 + 1] = -0.005 - Math.random() * 0.01;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
      sizes[i] = Math.random() * 0.08 + 0.015;
    }
    return { positions, velocities, sizes };
  }, [count]);

  useFrame(() => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] += velocities[i * 3 + 0];
      pos[i * 3 + 1] += velocities[i * 3 + 1];
      pos[i * 3 + 2] += velocities[i * 3 + 2];
      // wrap when below
      if (pos[i * 3 + 1] < -12) {
        pos[i * 3 + 1] = 12;
        pos[i * 3 + 0] = (Math.random() - 0.5) * 18;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;

    // gentle group rotation from mouse
    const mx = mouseRef.current?.x || 0;
    const my = mouseRef.current?.y || 0;
    ref.current.rotation.y += (mx * 0.1 - ref.current.rotation.y) * 0.02;
    ref.current.rotation.x += (my * 0.05 - ref.current.rotation.x) * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#D4D4D6"
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </points>
  );
}

/* ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
   LIGHT SHAFT â vertical volumetric beam from above
   ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ */
function LightShaft() {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    // subtle pulsing
    const t = state.clock.getElapsedTime();
    ref.current.material.opacity = 0.08 + Math.sin(t * 0.6) * 0.015;
  });

  // create radial gradient texture on the fly
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, 'rgba(232, 232, 229, 1)');
    grad.addColorStop(0.4, 'rgba(232, 232, 229, 0.5)');
    grad.addColorStop(1, 'rgba(232, 232, 229, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    return tex;
  }, []);

  return (
    <mesh ref={ref} position={[0, 0, -2]} rotation={[0, 0, 0]}>
      <planeGeometry args={[6, 24]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.1}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
   DISTANT ORANGE GLOW â pulse at the bottom of the frame
   ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ */
function OrangeGlow() {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.material.opacity = 0.32 + Math.sin(t * 0.5) * 0.06;
  });

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    grad.addColorStop(0, 'rgba(255, 107, 26, 1)');
    grad.addColorStop(0.4, 'rgba(255, 107, 26, 0.3)');
    grad.addColorStop(1, 'rgba(255, 107, 26, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    return tex;
  }, []);

  return (
    <mesh ref={ref} position={[0, -8, -1]}>
      <planeGeometry args={[16, 12]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.32}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
   HORIZON LINE â single hairline near the top
   ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ */
function HorizonLine() {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.material.opacity = 0.15 + Math.sin(state.clock.getElapsedTime() * 0.4) * 0.04;
  });

  return (
    <lineSegments ref={ref} position={[0, 5.5, -1]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2}
          array={new Float32Array([-10, 0, 0, 10, 0, 0])}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#FF6B1A" transparent opacity={0.15} />
    </lineSegments>
  );
}

/* ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
   CAMERA RIG â scroll-linked dolly downward
   ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ */
function CameraRig({ scrollProgress }) {
  const { camera } = useThree();
  useFrame(() => {
    const p = Math.min(scrollProgress.current, 1);
    camera.position.y = -p * 4;
    camera.position.z = 8 - p * 1.5;
  });
  return null;
}

function Scene({ mouseRef, scrollProgress }) {
  return (
    <>
      <color attach="background" args={['#0F0F0F']} />
      <fog attach="fog" args={['#0F0F0F', 10, 24]} />
      <LightShaft />
      <Dust mouseRef={mouseRef} />
      <HorizonLine />
      <OrangeGlow />
      <CameraRig scrollProgress={scrollProgress} />
    </>
  );
}

/* ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
   HERO â overlay typography + UI
   ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ */
export default function Hero() {
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollProgress = useRef(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      scrollProgress.current = v;
    });
  }, [scrollYProgress]);

  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5, 0.8], [1, 1, 0]);
  const overlayY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const depth = useTransform(scrollYProgress, [0, 1], [15, 75]);
  const [depthText, setDepthText] = useState('15.00');

  useEffect(() => {
    return depth.on('change', (v) => setDepthText(v.toFixed(2)));
  }, [depth]);

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
      const h = String(d.getUTCHours()).padStart(2, '0');
      const m = String(d.getUTCMinutes()).padStart(2, '0');
      const s = String(d.getUTCSeconds()).padStart(2, '0');
      setTime(`${h}:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section ref={containerRef} className="relative h-[140vh] bg-coal">
      {/* THREE.JS CANVAS â fixed in viewport during scroll */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Suspense fallback={null}>
            <Canvas
              camera={{ position: [0, 0, 8], fov: 42 }}
              dpr={[1, 2]}
              gl={{ antialias: true, alpha: false }}
            >
              <Scene mouseRef={mouseRef} scrollProgress={scrollProgress} />
            </Canvas>
          </Suspense>
        </div>

        {/* SCAN LINE */}
        <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
          <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent animate-scan" />
        </div>

        {/* VIGNETTE */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(15,15,15,0.6)_100%)]" />

        {/* CONTENT OVERLAY */}
        <motion.div
          style={{ opacity: overlayOpacity, y: overlayY }}
          className="relative z-20 h-screen flex flex-col"
        >
          {/* TOP METADATA */}
          <div className="px-6 md:px-12 pt-32 md:pt-36 grid grid-cols-12 gap-6">
            <div className="col-span-6 md:col-span-3 label text-bone/40">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-orange rounded-full animate-pulse" />
                <span className="text-orange">SYS Â· LIVE</span>
              </div>
              <div className="mt-2 text-bone/30 tabular-nums">{time} UTC</div>
            </div>
            <div className="hidden md:block md:col-span-3 label text-bone/40">
              <div className="text-bone/25">SECTION</div>
              <div className="mt-2">N° 01 / Genesis</div>
            </div>
            <div className="hidden md:block md:col-span-3 label text-bone/40">
              <div className="text-bone/25">PROJECT</div>
              <div className="mt-2">MNS-1 / ARCHIVE</div>
            </div>
            <div className="col-span-6 md:col-span-3 label text-bone/40 md:text-right">
              <div className="text-bone/25">COORDINATES</div>
              <div className="mt-2 tabular-nums">25.2048° N Â· 55.2708° E</div>
            </div>
          </div>

          {/* CENTER WORDMARK */}
          <div className="flex-1 flex items-center px-6 md:px-12">
            <div className="w-full">
              {/* TAGLINE */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="label text-orange mb-8 flex items-center gap-4"
              >
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: 'left' }}
                  className="block w-12 h-px bg-orange"
                />
                <span>A NEW LAYER OF LIVING</span>
              </motion.div>

              {/* MINUS â word reveal */}
              <h1 className="display leading-[0.82] tracking-tighter">
                <span className="block overflow-hidden">
                  <motion.span
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="block text-[22vw] md:text-[18vw] lg:text-[15vw] text-bone"
                  >
                    MINUS
                  </motion.span>
                </span>

                {/* 1 â italic with orange slash bar drawn through */}
                <span className="block overflow-hidden relative -mt-[3vw]">
                  <motion.span
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 1.2, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="text-[22vw] md:text-[18vw] lg:text-[15vw] text-bone italic inline-flex items-baseline gap-[3vw] relative"
                  >
                    <motion.span
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 1, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
                      style={{ transformOrigin: 'left' }}
                      className="block w-[12vw] h-[1vw] bg-orange relative top-[-4vw]"
                    />
                    <span>1</span>
                  </motion.span>
                </span>
              </h1>

              {/* DESCRIPTION + CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
                className="mt-10 md:mt-12 grid grid-cols-12 gap-6 items-end"
              >
                <div className="col-span-12 md:col-span-5 md:col-start-7">
                  <p className="text-bone/75 text-lg md:text-xl leading-relaxed max-w-md">
                    Subterranean residences engineered to military specification, finished to the standard of a private gallery. Built for the era of consequence.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Magnetic strength={0.25}>
                      <a
                        href="#projects"
                        data-cursor="EXPLORE"
                        className="label bg-orange text-ink px-6 py-3.5 hover:bg-orange-bright transition-colors inline-flex items-center gap-3"
                      >
                        Explore Archetypes
                        <span>→</span>
                      </a>
                    </Magnetic>
                    <Magnetic strength={0.2}>
                      <a
                        href="#contact"
                        data-cursor="ACCESS"
                        className="label border border-bone/30 text-bone px-6 py-3.5 hover:border-bone transition-all"
                      >
                        Request Access
                      </a>
                    </Magnetic>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* BOTTOM ROW */}
          <div className="px-6 md:px-12 pb-12 grid grid-cols-12 gap-6 items-end">
            <div className="col-span-6 md:col-span-3 label text-bone/40">
              <div className="text-bone/25">SCROLL Â· DESCEND</div>
              <div className="mt-2 flex items-center gap-2 text-orange tabular-nums">
                <motion.span
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  ↓
                </motion.span>
                <span>â{depthText}m</span>
              </div>
            </div>
            <div className="hidden md:flex md:col-span-6 items-center justify-center gap-4">
              <span className="h-px w-16 bg-bone/15" />
              <span className="label text-bone/30">CROSS-SECTION Â· LIVE</span>
              <span className="h-px w-16 bg-bone/15" />
            </div>
            <div className="col-span-6 md:col-span-3 label text-bone/40 md:text-right">
              <div className="text-bone/25">TIER</div>
              <div className="mt-2">CLEARANCE I â III</div>
            </div>
          </div>
        </motion.div>

        {/* BOTTOM MARQUEE â pinned to viewport bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-30 border-t border-bone/10 bg-coal/80 backdrop-blur-md overflow-hidden">
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
                  <span key={j} className="label text-bone/40 mx-8 flex items-center gap-3">
                    <span className="w-1 h-1 bg-orange rounded-full" />
                    {t}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
