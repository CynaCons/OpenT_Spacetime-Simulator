import { Line, OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo } from 'react'
import { schwarzschildWarp } from '../physics/relativity'
import { centralMassRadius, grStore, useGr } from '../state/grStore'
import { SceneAtmosphere } from './shared/SceneAtmosphere'
import { SceneLabel } from './shared/SceneLabel'

const BODIES: Record<
  'mercury' | 'earth' | 'jupiter',
  { a: number; color: string; period: number; name: string }
> = {
  mercury: { a: 3.2, color: '#b1b1b1', period: 4.5, name: 'Mercury' },
  earth: { a: 5.5, color: '#4f8cff', period: 10, name: 'Earth' },
  jupiter: { a: 9.5, color: '#d9b38c', period: 28, name: 'Jupiter' },
}

/** Direction the probe falls along (kept clear of planet start positions). */
const PROBE_ANG = 2.35
const MOON_ORBIT_R = 0.62
const MOON_PERIOD = 1.6

/** Position on the fabric surface for a given radius. */
function onFabric(r: number, ang: number, mass: number, lift = 0.16): [number, number, number] {
  return [Math.cos(ang) * r, schwarzschildWarp(mass, r) + lift, Math.sin(ang) * r]
}

function WarpedGrid({ mass, visible }: { mass: number; visible: boolean }) {
  // Square mesh + concentric rings — the rings read as the classic embedding funnel
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
        const r = Math.hypot(u, v)
        row.push([u, schwarzschildWarp(mass, r), v])
        col.push([v, schwarzschildWarp(mass, r), u])
      }
      out.push(row, col)
    }
    return out
  }, [mass])

  const rings = useMemo(() => {
    const out: Array<[number, number, number][]> = []
    for (let r = 1; r <= 7; r += 0.75) {
      const ring: [number, number, number][] = []
      for (let i = 0; i <= 80; i++) {
        const a = (i / 80) * Math.PI * 2
        ring.push([Math.cos(a) * r, schwarzschildWarp(mass, r), Math.sin(a) * r])
      }
      out.push(ring)
    }
    return out
  }, [mass])

  if (!visible) return null
  return (
    <>
      {lines.map((pts, i) => (
        <Line key={`g${i}`} points={pts} color="#31486e" lineWidth={1} transparent opacity={0.38} />
      ))}
      {rings.map((pts, i) => (
        <Line key={`r${i}`} points={pts} color="#46639a" lineWidth={1.1} transparent opacity={0.5} />
      ))}
    </>
  )
}

function CentralMass({ mass }: { mass: number }) {
  const r = centralMassRadius(mass)
  return (
    <group>
      <mesh position={[0, schwarzschildWarp(mass, 0.01) + r * 0.3, 0]}>
        <sphereGeometry args={[r, 32, 32]} />
        <meshBasicMaterial color="#ffcc66" />
      </mesh>
      <pointLight color="#ffd89a" intensity={50} distance={40} />
      <SceneLabel position={[0, r + 1.05, 0]} color="#ffcc66">
        M = {mass.toFixed(1)} M☉
      </SceneLabel>
    </group>
  )
}

/** Test probe released at rest: it falls only because the geometry is curved. */
function FallingProbe() {
  const mass = useGr((s) => s.massSolar)
  const phase = useGr((s) => s.probePhase)
  const r = useGr((s) => s.probeR)
  const r0 = useGr((s) => s.probeR0)
  const v = useGr((s) => s.probeV)
  const trailR = useGr((s) => s.probeTrailR)
  const picture = useGr((s) => s.picture)
  const showForce = picture === 'force' || picture === 'both'

  const pos = onFabric(r, PROBE_ANG, mass)
  const ghost = onFabric(r0, PROBE_ANG, mass)

  const trail = useMemo(
    () => trailR.map((tr) => onFabric(tr, PROBE_ANG, mass)),
    [trailR, mass],
  )

  return (
    <group>
      {/* release ring on the fabric */}
      <mesh position={ghost} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.38, 40]} />
        <meshBasicMaterial color="#7ddea8" transparent opacity={0.5} depthWrite={false} />
      </mesh>

      {/* flat-spacetime ghost: no curvature → released at rest, it just stays */}
      {phase !== 'ready' && (
        <group>
          <mesh position={ghost}>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshBasicMaterial color="#8fa3c4" transparent opacity={0.35} />
          </mesh>
          <SceneLabel position={[ghost[0], ghost[1] + 0.62, ghost[2]]} color="#8fa3c4">
            flat spacetime: stays put
          </SceneLabel>
        </group>
      )}

      {/* the probe itself */}
      <mesh position={pos}>
        <sphereGeometry args={[0.22, 20, 20]} />
        <meshStandardMaterial color="#7ddea8" emissive="#7ddea8" emissiveIntensity={0.45} />
      </mesh>
      <SceneLabel position={[pos[0], pos[1] + 0.6, pos[2]]} color="#7ddea8">
        {phase === 'ready'
          ? 'probe · at rest'
          : phase === 'landed'
            ? 'probe · landed'
            : `probe · falling ${Math.abs(v).toFixed(1)}`}
      </SceneLabel>

      {trail.length > 1 && (
        <Line points={trail} color="#7ddea8" lineWidth={2} transparent opacity={0.8} />
      )}

      {/* Newton's description of the same motion: a force pulling inward */}
      {showForce && phase === 'falling' && (
        <Line
          points={[pos, onFabric(Math.max(r - 1.4, 0.4), PROBE_ANG, mass, 0.3)]}
          color="#f07178"
          lineWidth={2}
        />
      )}
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
  const [x, y, z] = onFabric(b.a, ang, mass, 0.35)

  const orbit = useMemo(() => {
    const pts: [number, number, number][] = []
    for (let i = 0; i <= 96; i++) {
      const a = (i / 96) * Math.PI * 2 + precess * 0.15
      pts.push(onFabric(b.a, a, mass, 0.2))
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
      {/* the Moon: falling around Earth forever — its geodesic closes into an orbit */}
      {bodyKey === 'earth' && <MoonAround x={x} y={y} z={z} t={t} />}
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
        <SceneLabel position={[x, y + 0.62, z]} color={b.color}>
          {b.name} · geodesic
        </SceneLabel>
      )}
    </group>
  )
}

function MoonAround({ x, y, z, t }: { x: number; y: number; z: number; t: number }) {
  const ang = (t / MOON_PERIOD) * Math.PI * 2
  return (
    <mesh position={[x + Math.cos(ang) * MOON_ORBIT_R, y + 0.05, z + Math.sin(ang) * MOON_ORBIT_R]}>
      <sphereGeometry args={[0.09, 12, 12]} />
      <meshStandardMaterial color="#c9ccd4" roughness={0.9} />
    </mesh>
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
      const x = t
      const z = b + bend * Math.exp(-((t * t) / 18))
      const y = schwarzschildWarp(mass, Math.hypot(x, z)) + 0.15
      out.push([x, y, z])
    }
    return out
  }, [mass])

  return (
    <group>
      <Line points={pts} color="#ffe566" lineWidth={2} transparent opacity={0.9} />
      <SceneLabel position={[pts[8][0], pts[8][1] + 0.5, pts[8][2]]} color="#ffe566">
        light
      </SceneLabel>
    </group>
  )
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
      <SceneAtmosphere background="#03060e" fogNear={22} fogFar={60} starCount={2600} />

      <WarpedGrid mass={mass} visible={showGrid} />
      <CentralMass mass={mass} />
      <FallingProbe />

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

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={4}
        maxDistance={45}
        target={[0, -0.5, 0]}
      />
    </>
  )
}
