import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { Html, Line, Stars } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import type { Mesh } from 'three'
import { AU_SCENE, PLANETS, SUN, meanMotion } from '../physics/solarSystemData'
import { simulationStore, useSimulation } from '../state/simulationStore'

function OrbitRing({ radius }: { radius: number }) {
  const points = useMemo(() => {
    const segs = 128
    const pts: [number, number, number][] = []
    for (let i = 0; i <= segs; i++) {
      const t = (i / segs) * Math.PI * 2
      pts.push([Math.cos(t) * radius, 0, Math.sin(t) * radius])
    }
    return pts
  }, [radius])

  return <Line points={points} color="#2a3f66" lineWidth={1} transparent opacity={0.7} />
}

function Planet({
  id,
  name,
  a,
  periodDays,
  color,
  visualRadius,
  simDays,
  showLabel,
}: {
  id: string
  name: string
  a: number
  periodDays: number
  color: string
  visualRadius: number
  simDays: number
  showLabel: boolean
}) {
  const ref = useRef<Mesh>(null)
  const r = a * AU_SCENE
  const angle = meanMotion(periodDays) * simDays
  const x = Math.cos(angle) * r
  const z = Math.sin(angle) * r
  const selected = useSimulation((s) => s.selectedBodyId === id)

  const onSelect = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    simulationStore.selectBody(id)
  }

  const onFocus = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    simulationStore.focusBody(id)
  }

  return (
    <group position={[x, 0, z]}>
      <mesh ref={ref} onClick={onSelect} onDoubleClick={onFocus}>
        <sphereGeometry args={[visualRadius, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={selected ? color : '#000000'}
          emissiveIntensity={selected ? 0.25 : 0}
        />
      </mesh>
      {showLabel && (
        <Html distanceFactor={28} style={{ pointerEvents: 'none' }}>
          <div
            style={{
              color: selected ? '#fff' : '#9eb2d4',
              fontSize: 12,
              whiteSpace: 'nowrap',
              textShadow: '0 1px 4px #000',
              transform: 'translate(-50%, 8px)',
            }}
          >
            {name}
          </div>
        </Html>
      )}
    </group>
  )
}

function SunBody() {
  return (
    <group>
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          simulationStore.selectBody(null)
        }}
        onDoubleClick={(e) => {
          e.stopPropagation()
          simulationStore.focusSun()
        }}
      >
        <sphereGeometry args={[SUN.visualRadius, 48, 48]} />
        <meshBasicMaterial color={SUN.color} />
      </mesh>
      <pointLight color="#ffd89a" intensity={120} distance={600} decay={2} />
      <ambientLight intensity={0.12} />
    </group>
  )
}

/** Advances simulation time from frame delta */
function TimeDriver() {
  useFrame((_, dt) => {
    const { speed, paused } = simulationStore.getState()
    if (paused || speed === 0) return
    // 1 real second → `speed` simulated days (scaffold scaling)
    simulationStore.advanceTime(dt * speed)
  })
  return null
}

export function SolarSystemScene() {
  const simDays = useSimulation((s) => s.simDays)
  const showOrbits = useSimulation((s) => s.showOrbits)
  const showLabels = useSimulation((s) => s.showLabels)

  return (
    <>
      <TimeDriver />
      <color attach="background" args={['#050814']} />
      <Stars radius={200} depth={60} count={4000} factor={3} saturation={0} fade speed={0.4} />
      <SunBody />
      {PLANETS.map((p) => (
        <group key={p.id}>
          {showOrbits && <OrbitRing radius={p.a * AU_SCENE} />}
          <Planet
            id={p.id}
            name={p.name}
            a={p.a}
            periodDays={p.periodDays}
            color={p.color}
            visualRadius={p.visualRadius}
            simDays={simDays}
            showLabel={showLabels}
          />
        </group>
      ))}
      {/* soft fill so night side of planets remains readable */}
      <hemisphereLight args={['#9bb7ff', '#0a0e18', 0.35]} />
    </>
  )
}
