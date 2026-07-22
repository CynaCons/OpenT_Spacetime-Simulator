import { Html, Line, OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, type CSSProperties } from 'react'
import {
  GPS_GR_US_PER_DAY,
  GPS_NET_US_PER_DAY,
  GPS_SR_US_PER_DAY,
  clockErrorUsToKm,
  deflectionArcsec,
} from '../physics/relativity'
import { proofsStore, useProofs } from '../state/proofsStore'
import { SceneAtmosphere } from './shared/SceneAtmosphere'

function EclipseDemo() {
  const model = useProofs((s) => s.deflectionModel)
  const phase = useProofs((s) => s.eclipsePhase)
  const delta = deflectionArcsec(model)
  // Visual bend scale for teaching
  const bend = (delta / 1.75) * 0.55

  const rays = useMemo(() => {
    const out: Array<[number, number, number][]> = []
    for (let k = -2; k <= 2; k++) {
      const z0 = k * 0.55
      const pts: [number, number, number][] = []
      for (let i = 0; i <= 40; i++) {
        const t = i / 40
        const x = -8 + t * 16
        // bend near x=0 (sun)
        const fall = Math.exp(-(x * x) / 3.5)
        const z = z0 + Math.sign(z0 || 1) * bend * fall * (x > 0 ? 1 : 0.15)
        // slight y for 3d
        pts.push([x, 0.2 + Math.abs(z0) * 0.05, z])
      }
      out.push(pts)
    }
    return out
  }, [bend])

  // Apparent star positions on right (observed)
  const stars = useMemo(() => {
    return [-2, -1, 0, 1, 2].map((k, i) => {
      const trueZ = k * 0.55
      const appZ = trueZ + Math.sign(trueZ || 1) * bend * 0.9
      return { trueZ, appZ, i }
    })
  }, [bend])

  const moonX = -1.2 + phase * 2.4

  return (
    <group>
      {/* Sun */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[1.1, 40, 40]} />
        <meshBasicMaterial color="#ffaa33" />
      </mesh>
      {/* corona hint during eclipse */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[1.25, 32, 32]} />
        <meshBasicMaterial color="#ffcc66" transparent opacity={0.15} />
      </mesh>
      {/* Moon covering */}
      <mesh position={[moonX, 0.25, 0.9]}>
        <sphereGeometry args={[0.95, 32, 32]} />
        <meshStandardMaterial color="#222830" />
      </mesh>

      {rays.map((pts, i) => (
        <Line key={i} points={pts} color="#ffe566" lineWidth={1.5} transparent opacity={0.85} />
      ))}

      {/* true vs apparent stars on sky plane (right) */}
      {stars.map((s) => (
        <group key={s.i}>
          <mesh position={[7.5, 0.3, s.trueZ]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color="#5b9dff" transparent opacity={0.45} />
          </mesh>
          <mesh position={[7.8, 0.3, s.appZ]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color="#fff" />
          </mesh>
        </group>
      ))}

      <Html position={[0, 2.4, 0]} center style={{ pointerEvents: 'none' }}>
        <div style={{ ...tag('#e8eefc'), textAlign: 'center' }}>
          1919 eclipse thought-experiment
          <br />
          Deflection model: <strong>{model.toUpperCase()}</strong> → δ ≈ {delta.toFixed(3)}″
          <br />
          <span style={{ color: '#8b9bb8', fontSize: 10 }}>
            White = apparent star · Blue ghost = undeflected direction
          </span>
        </div>
      </Html>
    </group>
  )
}

function GpsDemo() {
  const days = useProofs((s) => s.gpsDays)
  const sr = useProofs((s) => s.gpsApplySR)
  const gr = useProofs((s) => s.gpsApplyGR)

  let rate = GPS_NET_US_PER_DAY
  if (sr && gr) rate = 0
  else if (sr && !gr) rate = GPS_GR_US_PER_DAY
  else if (!sr && gr) rate = GPS_SR_US_PER_DAY
  // if neither applied, full net uncorrected error accumulates

  const errUs = rate * days
  const errKm = clockErrorUsToKm(errUs)

  const sats = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2
      return { a, r: 3.2 }
    })
  }, [])

  return (
    <group>
      <mesh>
        <sphereGeometry args={[1.2, 40, 40]} />
        <meshStandardMaterial color="#2a6ad4" roughness={0.7} />
      </mesh>
      {/* atmosphere */}
      <mesh>
        <sphereGeometry args={[1.28, 32, 32]} />
        <meshBasicMaterial color="#6eb6ff" transparent opacity={0.12} />
      </mesh>

      {sats.map((s, i) => {
        const ang = s.a + days * 0.9
        const x = Math.cos(ang) * s.r
        const z = Math.sin(ang) * s.r
        const y = Math.sin(ang * 1.3) * 0.6
        return (
          <group key={i} position={[x, y, z]}>
            <mesh>
              <boxGeometry args={[0.18, 0.08, 0.28]} />
              <meshStandardMaterial color="#cfd8e8" metalness={0.4} />
            </mesh>
            <Line
              points={[
                [0, 0, 0],
                [-x * 0.15, -y * 0.15, -z * 0.15],
              ]}
              color="#7ddea8"
              lineWidth={1}
            />
          </group>
        )
      })}

      {/* “map pin” drifting with error */}
      <mesh position={[errKm * 0.08, 1.35, 0]}>
        <coneGeometry args={[0.12, 0.35, 8]} />
        <meshStandardMaterial
          color={Math.abs(errKm) < 0.5 ? '#7ddea8' : '#f07178'}
          emissive={Math.abs(errKm) < 0.5 ? '#7ddea8' : '#f07178'}
          emissiveIntensity={0.35}
        />
      </mesh>

      <Html position={[0, 3.2, 0]} center style={{ pointerEvents: 'none' }}>
        <div style={{ ...tag('#e8eefc'), textAlign: 'center', minWidth: 280 }}>
          GPS clocks · t ≈ {days.toFixed(1)} days
          <br />
          SR term ≈ {GPS_SR_US_PER_DAY} µs/day · GR term ≈ +{GPS_GR_US_PER_DAY} µs/day
          <br />
          Net if uncorrected ≈ {GPS_NET_US_PER_DAY.toFixed(1)} µs/day
          <br />
          <strong style={{ color: Math.abs(errKm) < 0.5 ? '#7ddea8' : '#f07178' }}>
            Position error ≈ {errKm.toFixed(1)} km
          </strong>
          <br />
          <span style={{ fontSize: 10, color: '#8b9bb8' }}>
            Apply both SR + GR corrections → error stays ~0
          </span>
        </div>
      </Html>
    </group>
  )
}

function Driver() {
  useFrame((_, dt) => proofsStore.tick(dt))
  return null
}

export function ProofsScene() {
  const sub = useProofs((s) => s.subDemo)

  return (
    <>
      <Driver />
      <SceneAtmosphere background="#02060f" fogNear={20} fogFar={55} starCount={3800} />
      <directionalLight position={[6, 8, 4]} intensity={1.25} color="#fff2d6" />

      {sub === 'eclipse' ? <EclipseDemo /> : <GpsDemo />}

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={3}
        maxDistance={35}
        target={[0, 0.2, 0]}
        autoRotate={sub === 'gps'}
        autoRotateSpeed={0.4}
      />
    </>
  )
}

function tag(color: string): CSSProperties {
  return {
    color,
    fontSize: 12,
    lineHeight: 1.4,
    textShadow: '0 1px 3px #000',
    background: '#0a1220dd',
    padding: '6px 10px',
    borderRadius: 6,
    border: `1px solid ${color}44`,
  }
}
