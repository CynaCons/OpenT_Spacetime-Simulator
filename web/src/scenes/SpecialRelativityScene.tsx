import { Line, OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo } from 'react'
import { contractedLength, lorentzGamma } from '../physics/relativity'
import { srStore, useSr } from '../state/srStore'
import { SceneAtmosphere } from './shared/SceneAtmosphere'
import { SceneLabel } from './shared/SceneLabel'

const C_SCENE = 4 // scene units per “c” for light travel

function LightClock({
  x,
  moving,
  beta,
  labTime,
  label,
}: {
  x: number
  moving: boolean
  beta: number
  labTime: number
  label: string
}) {
  const H = 2.2 // mirror separation (proper for rest clock)
  // Round-trip light time in rest frame of this clock
  const gamma = lorentzGamma(beta)
  // In lab frame: rest clock period T0 = 2H/c
  // Moving clock: light path longer → period T = γ T0; flash phase uses lab time
  const T0 = (2 * H) / C_SCENE
  const T = moving ? gamma * T0 : T0
  const phase = ((labTime % T) + T) % T
  // Pulse goes up then down
  const half = T / 2
  const goingUp = phase < half
  const u = goingUp ? phase / half : 1 - (phase - half) / half
  const localY = -H / 2 + u * H

  // Moving clock: translate along +x with velocity β c, wrap in a segment
  const Ltrack = 10
  const v = moving ? beta * C_SCENE : 0
  const x0 = moving ? ((x + v * labTime) % Ltrack) - Ltrack / 2 : x

  // Light path in lab: diagonal for moving clock
  const pulseX = moving
    ? x0 + (goingUp ? beta * C_SCENE * (phase) : beta * C_SCENE * phase) * 0 // keep pulse in clock frame
    : x0
  // Better: pulse co-moves with clock (drawn in clock rest; for lab view of path use diagonal line)
  const pathPts = useMemo(() => {
    if (!moving || beta < 0.01) {
      return [
        [x0, -H / 2, 0],
        [x0, H / 2, 0],
      ] as [number, number, number][]
    }
    // one half-trip diagonal in lab for intuition
    const dx = beta * C_SCENE * (H / C_SCENE) // β * time_for_half
    return [
      [x0 - dx * 0.5, -H / 2, 0],
      [x0 + dx * 0.5, H / 2, 0],
    ] as [number, number, number][]
  }, [moving, beta, x0, H])

  return (
    <group>
      {/* mirrors */}
      <mesh position={[x0, H / 2, 0]}>
        <boxGeometry args={[0.7, 0.08, 0.4]} />
        <meshStandardMaterial color="#cfd8e8" metalness={0.5} />
      </mesh>
      <mesh position={[x0, -H / 2, 0]}>
        <boxGeometry args={[0.7, 0.08, 0.4]} />
        <meshStandardMaterial color="#cfd8e8" metalness={0.5} />
      </mesh>
      {/* supports */}
      <mesh position={[x0 - 0.32, 0, 0]}>
        <boxGeometry args={[0.06, H, 0.06]} />
        <meshStandardMaterial color="#5b6a80" />
      </mesh>
      <mesh position={[x0 + 0.32, 0, 0]}>
        <boxGeometry args={[0.06, H, 0.06]} />
        <meshStandardMaterial color="#5b6a80" />
      </mesh>
      {/* light path guide */}
      <Line points={pathPts} color="#5b9dff" lineWidth={1} transparent opacity={0.35} />
      {/* photon */}
      <mesh position={[moving ? x0 : pulseX, localY, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshBasicMaterial color="#ffe566" />
      </mesh>
      <SceneLabel position={[x0, H / 2 + 0.55, 0]} color={moving ? '#e27b58' : '#7ddea8'}>
        {label}
        {moving && ` · γ ${gamma.toFixed(2)}`}
      </SceneLabel>
    </group>
  )
}

function LengthRod({ beta, labTime }: { beta: number; labTime: number }) {
  const L0 = 4
  const L = contractedLength(L0, beta)
  const v = beta * C_SCENE * 0.5
  const x = ((v * labTime) % 12) - 6

  return (
    <group position={[0, -3.2, 0]}>
      {/* rest rod ghost */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[L0, 0.15, 0.25]} />
        <meshStandardMaterial color="#5b9dff" transparent opacity={0.25} />
      </mesh>
      <SceneLabel position={[0, 0.75, 0]} color="#8ab4ff">
        at rest · L₀ = {L0.toFixed(1)}
      </SceneLabel>
      {/* moving contracted rod */}
      <mesh position={[x, -0.15, 0]}>
        <boxGeometry args={[L, 0.18, 0.28]} />
        <meshStandardMaterial color="#e27b58" metalness={0.2} />
      </mesh>
      <SceneLabel position={[x, -0.6, 0]} color="#e27b58">
        moving · L = {L.toFixed(2)}
      </SceneLabel>
    </group>
  )
}

function Driver() {
  useFrame((_, dt) => srStore.tick(dt))
  return null
}

export function SpecialRelativityScene() {
  const subDemo = useSr((s) => s.subDemo)
  const beta = useSr((s) => s.beta)
  const labTime = useSr((s) => s.labTime)
  const showGamma = useSr((s) => s.showGamma)
  const gamma = lorentzGamma(beta)

  return (
    <>
      <Driver />
      <SceneAtmosphere background="#050814" fogNear={18} fogFar={55} starCount={2200} />
      <directionalLight position={[5, 8, 4]} intensity={1.15} color="#fff2d6" />

      <gridHelper args={[24, 24, '#2a4a72', '#0c1524']} position={[0, -4, 0]} />

      {subDemo === 'lightclock' ? (
        <>
          <LightClock x={-3.5} moving={false} beta={0} labTime={labTime} label="Rest clock" />
          <LightClock x={2.5} moving beta={beta} labTime={labTime} label="Moving clock" />
          {/* velocity arrow for moving */}
          <Line
            points={[
              [1.2, -1.8, 0],
              [1.2 + beta * 2.5, -1.8, 0],
            ]}
            color="#e27b58"
            lineWidth={2}
          />
          <SceneLabel position={[1.2 + beta * 1.2, -2.25, 0]} color="#e27b58">
            v = {beta.toFixed(2)} c
          </SceneLabel>
        </>
      ) : (
        <LengthRod beta={beta} labTime={labTime} />
      )}

      {showGamma && (
        <SceneLabel position={[0, 3.6, 0]} color="#e8eefc" style={{ fontFamily: 'var(--mono)' }}>
          γ = {gamma.toFixed(3)}
        </SceneLabel>
      )}

      <OrbitControls
        makeDefault
        enableDamping
        target={[0, 0, 0]}
        minDistance={4}
        maxDistance={30}
      />
    </>
  )
}
