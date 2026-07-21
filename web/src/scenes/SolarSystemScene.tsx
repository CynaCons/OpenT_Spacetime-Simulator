import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { Html, Line, Stars } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import type { Mesh } from 'three'
import { Vector3 } from 'three'
import { accelMagnitude, circularSpeedAuPerDay } from '../physics/newton'
import { AU_SCENE, PLANETS, SUN, getBodyPosition, meanMotion } from '../physics/solarSystemData'
import { newtonStore, useNewton } from '../state/newtonStore'
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

function Arrow({
  origin,
  dir,
  color,
  length,
}: {
  origin: [number, number, number]
  dir: Vector3
  color: string
  length: number
}) {
  const d = dir.clone().normalize()
  if (d.lengthSq() < 1e-8) return null
  const end = new Vector3(origin[0], origin[1], origin[2]).addScaledVector(d, length)
  return (
    <Line
      points={[origin, [end.x, end.y, end.z]]}
      color={color}
      lineWidth={2}
      transparent
      opacity={0.95}
    />
  )
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
  showVelocity,
  showForce,
  showPeriods,
}: {
  id: string
  name: string
  a: number
  periodDays: number
  color: string
  visualRadius: number
  simDays: number
  showLabel: boolean
  showVelocity: boolean
  showForce: boolean
  showPeriods: boolean
}) {
  const ref = useRef<Mesh>(null)
  const r = a * AU_SCENE
  const angle = meanMotion(periodDays) * simDays
  const x = Math.cos(angle) * r
  const z = Math.sin(angle) * r
  const selected = useSimulation((s) => s.selectedBodyId === id)
  const tour = useNewton((s) => s.tourBodyId === id)

  // Tangential velocity direction (circular): d(angle)/dt → (-sin, 0, cos)
  const vDir = useMemo(() => new Vector3(-Math.sin(angle), 0, Math.cos(angle)), [angle])
  // Force toward sun
  const fDir = useMemo(() => new Vector3(-x, 0, -z), [x, z])

  const vLen = 1.1 + Math.log10(1 + a) * 0.35
  const fLen = 0.7 + 0.9 / Math.sqrt(a)

  const onSelect = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    simulationStore.selectBody(id)
    newtonStore.setTourBody(id)
  }

  const onFocus = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    simulationStore.focusBody(id)
    newtonStore.setTourBody(id)
  }

  const periodYears = periodDays / 365.25

  return (
    <group position={[x, 0, z]}>
      <mesh ref={ref} onClick={onSelect} onDoubleClick={onFocus}>
        <sphereGeometry args={[visualRadius, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={selected || tour ? color : '#000000'}
          emissiveIntensity={selected || tour ? 0.28 : 0}
        />
      </mesh>
      {showVelocity && (
        <Arrow origin={[0, 0, 0]} dir={vDir} color="#7ddea8" length={vLen} />
      )}
      {showForce && <Arrow origin={[0, 0, 0]} dir={fDir} color="#f07178" length={fLen} />}
      {(showLabel || showPeriods) && (
        <Html distanceFactor={28} style={{ pointerEvents: 'none' }}>
          <div
            style={{
              color: selected || tour ? '#fff' : '#9eb2d4',
              fontSize: 12,
              whiteSpace: 'nowrap',
              textShadow: '0 1px 4px #000',
              transform: 'translate(-50%, 8px)',
              textAlign: 'center',
            }}
          >
            {name}
            {showPeriods && (
              <div style={{ fontSize: 10, color: '#8b9bb8' }}>
                a={a.toFixed(2)} AU · T≈{periodYears < 1 ? `${periodDays.toFixed(0)} d` : `${periodYears.toFixed(1)} y`}
              </div>
            )}
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

function TimeDriver() {
  useFrame((_, dt) => {
    const { speed, paused } = simulationStore.getState()
    if (paused || speed === 0) return
    simulationStore.advanceTime(dt * speed)
  })
  return null
}

export function SolarSystemScene() {
  const simDays = useSimulation((s) => s.simDays)
  const showOrbits = useSimulation((s) => s.showOrbits)
  const showLabels = useSimulation((s) => s.showLabels)
  const showVelocity = useNewton((s) => s.showVelocity)
  const showForce = useNewton((s) => s.showForce)
  const showPeriods = useNewton((s) => s.showPeriods)
  const chapterId = useSimulation((s) => s.chapterId)
  const newtonChapter = chapterId === 'newtonian-solar-system'

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
            showVelocity={newtonChapter && showVelocity}
            showForce={newtonChapter && showForce}
            showPeriods={newtonChapter && showPeriods}
          />
        </group>
      ))}
      <hemisphereLight args={['#9bb7ff', '#0a0e18', 0.35]} />
    </>
  )
}

/** Focus tour helper used by Newton HUD */
export function focusTourBody(bodyId: string) {
  newtonStore.setTourBody(bodyId)
  simulationStore.selectBody(bodyId)
  simulationStore.focusBody(bodyId, true)
}

export function planetNewtonStats(bodyId: string, simDays: number) {
  const p = PLANETS.find((x) => x.id === bodyId)
  if (!p) return null
  const pos = getBodyPosition(bodyId, simDays)
  const rAu = p.a
  const v = circularSpeedAuPerDay(rAu)
  const acc = accelMagnitude(rAu)
  return {
    name: p.name,
    aAu: p.a,
    periodDays: p.periodDays,
    periodYears: p.periodDays / 365.25,
    vAuPerDay: v,
    accel: acc,
    pos,
  }
}
