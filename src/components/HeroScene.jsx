import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

/* ============== VILLA ============== */
function Villa() {
  return (
    <group position={[0, 0, -1.5]}>
      {/* Ground floor — main volume */}
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[6.5, 1.8, 3.5]} />
        <meshStandardMaterial color="#1F1B18" roughness={0.65} metalness={0.1} />
      </mesh>
      {/* Upper floor — set back */}
      <mesh position={[-0.8, 2.55, -0.2]} castShadow receiveShadow>
        <boxGeometry args={[4, 1.5, 3.2]} />
        <meshStandardMaterial color="#252220" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Roof brass cap — ground floor */}
      <mesh position={[0, 1.82, 0]} castShadow>
        <boxGeometry args={[6.7, 0.04, 3.6]} />
        <meshStandardMaterial color="#A8854A" roughness={0.4} metalness={0.85} />
      </mesh>
      {/* Roof brass cap — upper */}
      <mesh position={[-0.8, 3.32, -0.2]} castShadow>
        <boxGeometry args={[4.1, 0.04, 3.3]} />
        <meshStandardMaterial color="#A8854A" roughness={0.4} metalness={0.85} />
      </mesh>

      {/* Glowing window strip — front of ground floor */}
      <mesh position={[0, 0.95, 1.76]}>
        <planeGeometry args={[5.8, 1.2]} />
        <meshStandardMaterial
          color="#FFB55C"
          emissive="#FFA040"
          emissiveIntensity={1.8}
          roughness={0.1}
          metalness={0}
        />
      </mesh>
      {/* Glass facade overlay (subtle dark frame) */}
      {[-2.4, -1.2, 0, 1.2, 2.4].map((x) => (
        <mesh key={x} position={[x, 0.95, 1.77]}>
          <boxGeometry args={[0.05, 1.2, 0.005]} />
          <meshStandardMaterial color="#0A0808" />
        </mesh>
      ))}
      {/* Top/bottom horizontal frame */}
      <mesh position={[0, 0.36, 1.77]}>
        <boxGeometry args={[5.8, 0.05, 0.005]} />
        <meshStandardMaterial color="#0A0808" />
      </mesh>
      <mesh position={[0, 1.54, 1.77]}>
        <boxGeometry args={[5.8, 0.05, 0.005]} />
        <meshStandardMaterial color="#0A0808" />
      </mesh>

      {/* Glowing window strip — upper floor */}
      <mesh position={[-0.8, 2.55, 1.42]}>
        <planeGeometry args={[3.6, 0.95]} />
        <meshStandardMaterial
          color="#FFB55C"
          emissive="#FFA040"
          emissiveIntensity={1.5}
          roughness={0.1}
        />
      </mesh>

      {/* Side windows — soft glow */}
      <mesh position={[3.26, 0.95, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[2.2, 1.0]} />
        <meshStandardMaterial color="#FFB55C" emissive="#FFA040" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[-3.26, 0.95, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[2.2, 1.0]} />
        <meshStandardMaterial color="#FFB55C" emissive="#FFA040" emissiveIntensity={1.2} />
      </mesh>

      {/* POOL — right side of villa */}
      <mesh position={[4.5, 0.02, 0.8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.4, 1.2]} />
        <meshStandardMaterial color="#1F3B4A" roughness={0.05} metalness={0.4} />
      </mesh>
      {/* Pool water highlight */}
      <mesh position={[4.5, 0.025, 0.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.3, 1.1]} />
        <meshStandardMaterial
          color="#4A8AA0"
          emissive="#3A7090"
          emissiveIntensity={0.4}
          roughness={0.1}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* PALM TREES */}
      <PalmTree position={[-4.5, 0, 1.2]} scale={1.0} />
      <PalmTree position={[5.5, 0, -0.5]} scale={0.85} />
      <PalmTree position={[-4.2, 0, -1.4]} scale={0.7} />

      {/* DRIVEWAY / front terrace */}
      <mesh position={[0, 0.005, 2.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[7, 2]} />
        <meshStandardMaterial color="#2A2520" roughness={0.85} />
      </mesh>

      {/* Driveway brass inlay */}
      <mesh position={[0, 0.008, 2.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.3, 1.35, 64]} />
        <meshStandardMaterial color="#A8854A" metalness={0.8} roughness={0.4} emissive="#A8854A" emissiveIntensity={0.15} />
      </mesh>
    </group>
  );
}

function PalmTree({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.09, 2.4, 8]} />
        <meshStandardMaterial color="#3A2418" roughness={0.9} />
      </mesh>
      {/* Fronds — 8 fronds radiating outward */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.4, 2.4, Math.sin(angle) * 0.4]}
            rotation={[Math.cos(angle) * 0.4, angle, -0.4 + Math.sin(angle) * 0.2]}
            castShadow
          >
            <boxGeometry args={[0.05, 0.04, 1.0]} />
            <meshStandardMaterial color="#1A2A18" roughness={0.85} />
          </mesh>
        );
      })}
      {/* Coconut cluster */}
      <mesh position={[0, 2.35, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#1A0F08" />
      </mesh>
    </group>
  );
}

/* ============== BUNKER ============== */
function Bunker() {
  return (
    <group position={[0, -2.6, 0]}>
      {/* Outer shell - back wall */}
      <mesh position={[0, 0, -1.8]} receiveShadow>
        <boxGeometry args={[10, 3.2, 0.15]} />
        <meshStandardMaterial color="#100A05" roughness={0.9} />
      </mesh>
      {/* Outer shell - left & right walls */}
      <mesh position={[-5, 0, 0]} receiveShadow>
        <boxGeometry args={[0.15, 3.2, 3.6]} />
        <meshStandardMaterial color="#100A05" roughness={0.9} />
      </mesh>
      <mesh position={[5, 0, 0]} receiveShadow>
        <boxGeometry args={[0.15, 3.2, 3.6]} />
        <meshStandardMaterial color="#100A05" roughness={0.9} />
      </mesh>
      {/* Floor */}
      <mesh position={[0, -1.6, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[9.8, 3.5]} />
        <meshStandardMaterial color="#1A100A" roughness={0.85} metalness={0.1} />
      </mesh>
      {/* Ceiling */}
      <mesh position={[0, 1.55, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[9.8, 3.5]} />
        <meshStandardMaterial color="#0A0604" roughness={0.95} />
      </mesh>

      {/* Mid-floor divider */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[9.8, 3.5]} />
        <meshStandardMaterial color="#1A100A" roughness={0.85} />
      </mesh>

      {/* Internal walls — upper floor */}
      <mesh position={[-1.5, 0.78, 0]}>
        <boxGeometry args={[0.08, 1.55, 3.4]} />
        <meshStandardMaterial color="#1F1410" roughness={0.85} />
      </mesh>
      <mesh position={[2.5, 0.78, 0]}>
        <boxGeometry args={[0.08, 1.55, 3.4]} />
        <meshStandardMaterial color="#1F1410" roughness={0.85} />
      </mesh>

      {/* Internal walls — lower floor */}
      <mesh position={[-1.8, -0.78, 0]}>
        <boxGeometry args={[0.08, 1.55, 3.4]} />
        <meshStandardMaterial color="#1F1410" roughness={0.85} />
      </mesh>
      <mesh position={[1.5, -0.78, 0]}>
        <boxGeometry args={[0.08, 1.55, 3.4]} />
        <meshStandardMaterial color="#1F1410" roughness={0.85} />
      </mesh>

      {/* Brass trim along edges */}
      {[[-5, 1.55, 0], [5, 1.55, 0], [-5, -1.55, 0], [5, -1.55, 0]].map((p, i) => (
        <mesh key={i} position={p}>
          <boxGeometry args={[0.06, 0.06, 3.55]} />
          <meshStandardMaterial color="#A8854A" metalness={0.9} roughness={0.3} emissive="#A8854A" emissiveIntensity={0.15} />
        </mesh>
      ))}
      {[[-5, 0, 1.78], [5, 0, 1.78], [-5, 0, -1.78], [5, 0, -1.78]].map((p, i) => (
        <mesh key={'v' + i} position={p}>
          <boxGeometry args={[0.06, 3.15, 0.06]} />
          <meshStandardMaterial color="#A8854A" metalness={0.9} roughness={0.3} emissive="#A8854A" emissiveIntensity={0.15} />
        </mesh>
      ))}

      {/* ROOM CONTENTS */}
      {/* MASTER SUITE — left upper: bed */}
      <group position={[-3.2, 0.05, 0]}>
        <mesh position={[0, 0.18, 0]} castShadow>
          <boxGeometry args={[1.6, 0.25, 1.0]} />
          <meshStandardMaterial color="#3A2418" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.42, 0]} castShadow>
          <boxGeometry args={[1.6, 0.15, 1.0]} />
          <meshStandardMaterial color="#5C3A24" roughness={0.7} />
        </mesh>
        <mesh position={[-0.55, 0.55, 0]} castShadow>
          <boxGeometry args={[0.5, 0.2, 0.85]} />
          <meshStandardMaterial color="#A8854A" metalness={0.6} roughness={0.5} />
        </mesh>
        {/* Brass nightstand lamps */}
        <mesh position={[0.95, 0.5, -0.4]} castShadow>
          <boxGeometry args={[0.2, 0.4, 0.2]} />
          <meshStandardMaterial color="#A8854A" metalness={0.8} roughness={0.3} emissive="#FFB060" emissiveIntensity={0.4} />
        </mesh>
      </group>

      {/* MAJLIS — center upper: low seating + table */}
      <group position={[0.5, 0.05, 0]}>
        {/* L-shaped seating */}
        <mesh position={[-0.5, 0.15, 0.6]} castShadow>
          <boxGeometry args={[1.6, 0.3, 0.6]} />
          <meshStandardMaterial color="#3A2418" roughness={0.7} />
        </mesh>
        <mesh position={[-0.5, 0.4, 0.6]} castShadow>
          <boxGeometry args={[1.6, 0.2, 0.55]} />
          <meshStandardMaterial color="#5C3A24" roughness={0.6} />
        </mesh>
        <mesh position={[-0.5, 0.15, -0.6]} castShadow>
          <boxGeometry args={[1.6, 0.3, 0.6]} />
          <meshStandardMaterial color="#3A2418" roughness={0.7} />
        </mesh>
        <mesh position={[-0.5, 0.4, -0.6]} castShadow>
          <boxGeometry args={[1.6, 0.2, 0.55]} />
          <meshStandardMaterial color="#5C3A24" roughness={0.6} />
        </mesh>
        {/* Brass coffee table */}
        <mesh position={[0.6, 0.18, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.3, 16]} />
          <meshStandardMaterial color="#A8854A" metalness={0.85} roughness={0.3} emissive="#A8854A" emissiveIntensity={0.2} />
        </mesh>
        {/* Hanging brass lantern */}
        <mesh position={[0.6, 1.2, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.16, 0.35, 8]} />
          <meshStandardMaterial color="#A8854A" metalness={0.8} roughness={0.3} emissive="#FFB060" emissiveIntensity={1.2} />
        </mesh>
        <pointLight position={[0.6, 1.05, 0]} color="#FFB060" intensity={2.2} distance={2.5} decay={2} />
      </group>

      {/* VAULT — right upper: safe */}
      <group position={[3.6, 0.05, 0]}>
        <mesh position={[0, 0.5, -0.5]} castShadow>
          <boxGeometry args={[0.9, 1.0, 0.7]} />
          <meshStandardMaterial color="#0A0604" roughness={0.85} metalness={0.6} />
        </mesh>
        {/* Vault dial */}
        <mesh position={[0, 0.5, -0.15]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.05, 32]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#A8854A" metalness={0.95} roughness={0.2} />
        </mesh>
        {/* Display shelves */}
        <mesh position={[0, 0.3, 0.6]} castShadow>
          <boxGeometry args={[0.7, 0.05, 0.4]} />
          <meshStandardMaterial color="#5C4A2F" metalness={0.7} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.7, 0.6]} castShadow>
          <boxGeometry args={[0.7, 0.05, 0.4]} />
          <meshStandardMaterial color="#5C4A2F" metalness={0.7} roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.1, 0.6]} castShadow>
          <boxGeometry args={[0.7, 0.05, 0.4]} />
          <meshStandardMaterial color="#5C4A2F" metalness={0.7} roughness={0.4} />
        </mesh>
        {/* Items on shelves */}
        {[0.4, 0.8, 1.2].map((y, i) => (
          <mesh key={i} position={[-0.15, y, 0.6]} castShadow>
            <boxGeometry args={[0.12, 0.16, 0.12]} />
            <meshStandardMaterial color="#FFD088" metalness={0.95} roughness={0.15} emissive="#A8854A" emissiveIntensity={0.3} />
          </mesh>
        ))}
      </group>

      {/* PROVISIONING — left lower: shelves */}
      <group position={[-3.4, -1.45, 0]}>
        {[0.2, 0.55, 0.9, 1.25].map((y, i) => (
          <mesh key={i} position={[0, y, 0]} castShadow>
            <boxGeometry args={[1.6, 0.04, 1.0]} />
            <meshStandardMaterial color="#5C4A2F" roughness={0.7} metalness={0.5} />
          </mesh>
        ))}
        {/* Stocked items */}
        {[0.32, 0.67, 1.02].map((y) =>
          [-0.55, -0.3, -0.05, 0.2, 0.45].map((x, i) => (
            <mesh key={y + '-' + i} position={[x, y, 0]} castShadow>
              <boxGeometry args={[0.18, 0.22, 0.18]} />
              <meshStandardMaterial color={i % 2 ? '#3A2418' : '#5C3A24'} roughness={0.8} />
            </mesh>
          ))
        )}
      </group>

      {/* MECHANICAL — center lower: filtration */}
      <group position={[-0.15, -1.45, 0]}>
        <mesh position={[-0.6, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.9, 24]} />
          <meshStandardMaterial color="#1A100A" roughness={0.5} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 1.0, 24]} />
          <meshStandardMaterial color="#1A100A" roughness={0.5} metalness={0.7} />
        </mesh>
        <mesh position={[0.7, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.9, 24]} />
          <meshStandardMaterial color="#1A100A" roughness={0.5} metalness={0.7} />
        </mesh>
        {/* Gauges glowing */}
        <mesh position={[0, 0.85, 0.36]} rotation={[0, 0, 0]}>
          <circleGeometry args={[0.12, 24]} />
          <meshStandardMaterial color="#FF6B1A" emissive="#FF6B1A" emissiveIntensity={1.8} />
        </mesh>
        <mesh position={[-0.6, 0.8, 0.31]}>
          <circleGeometry args={[0.08, 24]} />
          <meshStandardMaterial color="#A8854A" emissive="#FFB060" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0.7, 0.8, 0.31]}>
          <circleGeometry args={[0.08, 24]} />
          <meshStandardMaterial color="#A8854A" emissive="#FFB060" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* SECURITY/SERVERS — right lower */}
      <group position={[3.3, -1.45, 0]}>
        {[-0.5, -0.1, 0.3, 0.7].map((x, i) => (
          <group key={i}>
            <mesh position={[x, 0.55, 0]} castShadow>
              <boxGeometry args={[0.3, 1.1, 0.5]} />
              <meshStandardMaterial color="#0A0604" roughness={0.6} metalness={0.6} />
            </mesh>
            {/* LED strips */}
            {[0.15, 0.35, 0.55, 0.75, 0.95].map((ly) => (
              <mesh key={ly} position={[x, ly, 0.26]}>
                <boxGeometry args={[0.04, 0.02, 0.005]} />
                <meshStandardMaterial color="#FF6B1A" emissive="#FF6B1A" emissiveIntensity={2} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </group>
  );
}

/* ============== ELEVATOR SHAFT ============== */
function Elevator() {
  const cabin = useRef();
  useFrame(({ clock }) => {
    if (cabin.current) {
      const t = (Math.sin(clock.getElapsedTime() * 0.4) + 1) / 2;
      cabin.current.position.y = -0.3 - t * 1.8;
    }
  });
  return (
    <group position={[0, 0, -0.6]}>
      {/* Shaft */}
      <mesh position={[0, -1.3, 0]}>
        <boxGeometry args={[0.4, 2.6, 0.4]} />
        <meshStandardMaterial color="#1A100A" roughness={0.6} metalness={0.4} transparent opacity={0.6} />
      </mesh>
      {/* Brass frame */}
      {[[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]].map((p, i) => (
        <mesh key={i} position={[p[0], -1.3, p[1]]}>
          <boxGeometry args={[0.04, 2.6, 0.04]} />
          <meshStandardMaterial color="#A8854A" metalness={0.9} roughness={0.3} emissive="#A8854A" emissiveIntensity={0.2} />
        </mesh>
      ))}
      {/* Cabin */}
      <mesh ref={cabin} position={[0, -0.5, 0]} castShadow>
        <boxGeometry args={[0.32, 0.45, 0.32]} />
        <meshStandardMaterial color="#5C4A2F" metalness={0.85} roughness={0.3} emissive="#FFB060" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

/* ============== GROUND PLATFORM with cutaway ============== */
function GroundPlatform() {
  return (
    <group>
      {/* Top surface — sand */}
      <mesh position={[0, 0, -1.8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 4]} />
        <meshStandardMaterial color="#8B5A2B" roughness={0.95} />
      </mesh>
      {/* Top surface — sand front area (driveway zone) */}
      <mesh position={[6.5, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3, 8]} />
        <meshStandardMaterial color="#8B5A2B" roughness={0.95} />
      </mesh>
      <mesh position={[-6.5, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3, 8]} />
        <meshStandardMaterial color="#8B5A2B" roughness={0.95} />
      </mesh>

      {/* Soil walls — back, left, right of the bunker cutaway */}
      {/* Back soil */}
      <mesh position={[0, -2.6, -1.85]} receiveShadow>
        <boxGeometry args={[10.05, 3.3, 0.1]} />
        <meshStandardMaterial color="#3A2418" roughness={0.95} />
      </mesh>
      {/* Left soil — outside bunker */}
      <mesh position={[-5.05, -2.6, 0]} receiveShadow>
        <boxGeometry args={[0.1, 3.3, 3.7]} />
        <meshStandardMaterial color="#3A2418" roughness={0.95} />
      </mesh>
      <mesh position={[5.05, -2.6, 0]} receiveShadow>
        <boxGeometry args={[0.1, 3.3, 3.7]} />
        <meshStandardMaterial color="#3A2418" roughness={0.95} />
      </mesh>
      {/* Bottom floor of section */}
      <mesh position={[0, -4.25, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 4]} />
        <meshStandardMaterial color="#1A0F08" roughness={0.95} />
      </mesh>

      {/* Distant dune backdrop */}
      <mesh position={[0, 2, -12]} receiveShadow>
        <planeGeometry args={[60, 14]} />
        <meshStandardMaterial color="#6B3B1F" roughness={1} />
      </mesh>
      {/* Far dune ridge */}
      <mesh position={[-8, 0.8, -10]} receiveShadow>
        <coneGeometry args={[5, 2.2, 4]} />
        <meshStandardMaterial color="#7B4520" roughness={1} />
      </mesh>
      <mesh position={[6, 0.6, -10]} receiveShadow>
        <coneGeometry args={[4, 1.8, 4]} />
        <meshStandardMaterial color="#7B4520" roughness={1} />
      </mesh>
    </group>
  );
}

/* ============== SKY ============== */
function Sky() {
  return (
    <mesh position={[0, 5, -18]}>
      <planeGeometry args={[80, 24]} />
      <meshBasicMaterial side={THREE.DoubleSide}>
        <canvasTexture
          attach="map"
          image={(() => {
            const c = document.createElement('canvas');
            c.width = 256;
            c.height = 128;
            const g = c.getContext('2d').createLinearGradient(0, 0, 0, 128);
            g.addColorStop(0, '#1A1410');
            g.addColorStop(0.4, '#3A2418');
            g.addColorStop(0.7, '#A8552A');
            g.addColorStop(1, '#E5A05A');
            const ctx = c.getContext('2d');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, 256, 128);
            // Sun
            const sun = ctx.createRadialGradient(200, 90, 4, 200, 90, 40);
            sun.addColorStop(0, '#FFE8A0');
            sun.addColorStop(0.3, '#FFC070');
            sun.addColorStop(1, '#FFC07000');
            ctx.fillStyle = sun;
            ctx.fillRect(0, 0, 256, 128);
            return c;
          })()}
        />
      </meshBasicMaterial>
    </mesh>
  );
}

/* ============== AUTO ROTATE WHEN IDLE ============== */
function CameraController() {
  const { camera } = useThree();
  const t = useRef(0);
  useFrame((_, delta) => {
    t.current += delta;
    // Gentle pulsing of camera position to feel alive
  });
  return null;
}

/* ============== MAIN SCENE ============== */
export default function HeroScene() {
  return (
    <Canvas
      shadows
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
      camera={{ position: [8, 3, 9], fov: 38 }}
    >
      <color attach="background" args={['#0A0604']} />
      <fog attach="fog" args={['#1A0F08', 15, 30]} />

      {/* Lighting — golden hour */}
      <ambientLight intensity={0.25} color="#FFE0C0" />
      <directionalLight
        position={[12, 8, 6]}
        intensity={2.2}
        color="#FFB060"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={30}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />
      <directionalLight position={[-8, 4, -4]} intensity={0.4} color="#5588AA" />
      {/* Underground accent — orange uplight */}
      <pointLight position={[0, -2.5, 1.5]} intensity={1.5} color="#FF8830" distance={8} decay={2} />

      <Sky />
      <GroundPlatform />
      <Villa />
      <Bunker />
      <Elevator />
      <CameraController />

      <OrbitControls
        target={[0, -0.8, 0]}
        enablePan={false}
        enableZoom={true}
        minDistance={9}
        maxDistance={16}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2.05}
        minAzimuthAngle={-Math.PI / 2.3}
        maxAzimuthAngle={Math.PI / 2.3}
        enableDamping
        dampingFactor={0.06}
        rotateSpeed={0.7}
        autoRotate
        autoRotateSpeed={0.25}
      />
    </Canvas>
  );
}
