import { Html, Line, OrbitControls, Stars } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, type CSSProperties } from 'react'
import { schwarzschildWarp } from '../physics/relativity'
import { grStore, useGr } from '../state/grStore'

const BODIES: Record<
  'mercury' | 'earth' | 'jupiter',
  { a: number; color: string; period: number; name: string }
> = {
  mercury: { a: 3.2, color: '#b1b1b1', period: 4.5, name: 'Mercury' },
  earth: { a: 5.5, color: '#4f8cff', period: 10, name: 'Earth' },
  jupiter: { a: 9.5, color: '#d9b38c', period: 28, name: 'Jupiter' },
}

function WarpedGrid({ mass, visible }: { mass: number; visible: boolean }) {
  const lines = useMemo(() => {
    const out: Array<[number, number, number][]> = []
    const N = 18
    const span = 14
    for (let i = 0; i <= N; i++) {
      const u = -span / 2 + (i / N) * span
      const row: [number, number, number][] = []
      const col: [number, number, number][] = []
      for (let j = 0; j <= N; j++) {
        const v = -span / 2 + (j / N) * span
        const r1 = Math.hypot(u, v)
        const r2 = Math.hypot(v, u)
        row.push([u, schwarzschildWarp(mass, r1), v])
        col.push([v, schwarzschildWarp(mass, r2), u])
      }
      out.push(row, col)
    }
    return out
  }, [mass])

  if (!visible) return null
  return (
    <>
      {lines.map((pts, i) => (
        <Line
          key={i}
          points={pts}
          color="#3d5a80"
          lineWidth={1}
          transparent
          opacity={0.55}
        />
      ))}
    </>
  )
}

function CentralMass({ mass }: { mass: number }) {
  const r = 0.55 + mass * 0.25
  return (
    <group>
      <mesh position={[0, schwarzschildWarp(mass, 0.01) + r * 0.3, 0]}>
        <sphereGeometry args={[r, 32, 32]} />
        <meshBasicMaterial color="#ffcc66" />
      </mesh>
      <pointLight color="#ffd89a" intensity={50} distance={40} />
      <Html position={[0, r + 0.8, 0]} center style={{ pointerEvents: 'none' }}>
        <div style={tag('#ffcc66')}>Mass M = {mass.toFixed(1)} M☉ (toy)</div>
      </Html>
    </group>
  )
}

function PlanetGeodesic({
  bodyKey,
  t,
  mass,
  highlight,
  showForce,
}: {
  bodyKey: keyof typeof BODIES
  t: number
  mass: number
  highlight: boolean
  showForce: boolean
}) {
  const b = BODIES[bodyKey]
  // Slight GR-ish precession for mercury when mass high
  const precess =
    bodyKey === 'mercury' ? t * 0.08 * mass : bodyKey === 'earth' ? t * 0.01 * mass : 0
  const ang = (t / b.period) * Math.PI * 2 + precess
  const x = Math.cos(ang) * b.a
  const z = Math.sin(ang) * b.a
  const y = schwarzschildWarp(mass, Math.hypot(x, z)) + 0.35

  const orbit = useMemo(() => {
    const pts: [number, number, number][] = []
    for (let i = 0; i <= 96; i++) {
      const a = (i / 96) * Math.PI * 2 + precess * 0.15
      const px = Math.cos(a) * b.a
      const pz = Math.sin(a) * b.a
      const py = schwarzschildWarp(mass, Math.hypot(px, pz)) + 0.2
      pts.push([px, py, pz])
    }
    return pts
  }, [b.a, mass, precess])

  return (
    <group>
      <Line
        points={orbit}
        color={highlight ? b.color : '#2a3f66'}
        lineWidth={highlight ? 2 : 1}
        transparent
        opacity={highlight ? 0.95 : 0.45}
      />
      <mesh position={[x, y, z]}>
        <sphereGeometry args={[highlight ? 0.28 : 0.2, 20, 20]} />
        <meshStandardMaterial
          color={b.color}
          emissive={highlight ? b.color : '#000'}
          emissiveIntensity={highlight ? 0.3 : 0}
        />
      </mesh>
      {showForce && (
        <Line
          points={[
            [x, y, z],
            [x * 0.55, y * 0.7, z * 0.55],
          ]}
          color="#f07178"
          lineWidth={2}
        />
      )}
      {highlight && (
        <Html position={[x, y + 0.5, z]} center style={{ pointerEvents: 'none' }}>
          <div style={tag(b.color)}>
            {b.name}
            <br />
            geodesic (free-fall path)
          </div>
        </Html>
      )}
    </group>
  )
}

function PhotonPath({ mass }: { mass: number }) {
  // Light ray grazing the sun — bent more with mass
  const pts = useMemo(() => {
    const out: [number, number, number][] = []
    const b = 2.2 // impact parameter
    const bend = 0.35 * mass
    for (let i = 0; i <= 60; i++) {
      const t = -12 + (i / 60) * 24
      // hyperbolic-ish bend in xz plane elevated on fabric
      const x = t
      const z = b + bend * Math.exp(-((t * t) / 18))
      const y = schwarzschildWarp(mass, Math.hypot(x, z)) + 0.15
      out.push([x, y, z])
    }
    return out
  }, [mass])

  return <Line points={pts} color="#ffe566" lineWidth={2} transparent opacity={0.9} />
}

function Driver() {
  useFrame((_, dt) => grStore.tick(dt))
  return null
}

export function GeneralRelativityScene() {
  const mass = useGr((s) => s.massSolar)
  const picture = useGr((s) => s.picture)
  const showPhoton = useGr((s) => s.showPhoton)
  const showGrid = useGr((s) => s.showGrid)
  const focus = useGr((s) => s.focusBody)
  const t = useGr((s) => s.animT)

  const showForce = picture === 'force' || picture === 'both'
  const showGeo = picture === 'geodesic' || picture === 'both'

  return (
    <>
      <Driver />
      <color attach="background" args={['#03060e']} />
      <Stars radius={90} depth={35} count={2200} factor={2.4} saturation={0} fade />
      <ambientLight intensity={0.3} />
      <hemisphereLight args={['#9bb7ff', '#080c14', 0.4]} />

      <WarpedGrid mass={mass} visible={showGrid} />
      <CentralMass mass={mass} />

      {showGeo &&
        (Object.keys(BODIES) as Array<keyof typeof BODIES>).map((k) => (
          <PlanetGeodesic
            key={k}
            bodyKey={k}
            t={t}
            mass={mass}
            highlight={k === focus}
            showForce={showForce}
          />
        ))}

      {showPhoton && <PhotonPath mass={mass} />}

      <Html position={[0, 4.5, 0]} center style={{ pointerEvents: 'none' }}>
        <div style={{ ...tag('#c5d4f0'), textAlign: 'center', maxWidth: 360, whiteSpace: 'normal' }}>
          Spacetime fabric is a <strong>metaphor</strong> (not literal 4D).
          <br />
          Planets follow geodesics — “straightest” paths in curved geometry.
        </div>
      </Html>

      <OrbitControls makeDefault enableDamping minDistance={4} maxDistance={45} target={[0, -0.5, 0]} />
    </>
  )
}

function tag(color: string): CSSProperties {
  return {
    color,
    fontSize: 11,
    textShadow: '0 1px 3px #000',
    background: '#0a1220cc',
    padding: '4px 8px',
    borderRadius: 4,
    border: `1px solid ${color}55`,
  }
}
