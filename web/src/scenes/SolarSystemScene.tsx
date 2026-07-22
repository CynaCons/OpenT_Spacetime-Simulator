import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { Html, Line } from '@react-three/drei'
import { useMemo, useRef, useState } from 'react'
import type { Mesh } from 'three'
import { MathUtils, Vector3 } from 'three'
import { accelMagnitude, circularSpeedAuPerDay } from '../physics/newton'
import { AU_SCENE, PLANETS, SUN, getBodyPosition, meanMotion } from '../physics/solarSystemData'
import { newtonStore, useNewton } from '../state/newtonStore'
import { simulationStore, useSimulation } from '../state/simulationStore'
import { SceneAtmosphere } from './shared/SceneAtmosphere'

function OrbitRing({ radius, active }: { radius: number; active?: boolean }) {
  const points = useMemo(() => {
    const segs = 160
    const pts: [number, number, number][] = []
    for (let i = 0; i <= segs; i++) {
      const t = (i / segs) * Math.PI * 2
      pts.push([Math.cos(t) * radius, 0, Math.sin(t) * radius])
    }
    return pts
  }, [radius])

  return (
    <Line
      points={points}
      color={active ? '#5b9dff' : '#2a3f66'}
      lineWidth={active ? 1.8 : 1}
      transparent
      opacity={active ? 0.95 : 0.55}
    />
  )
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
      lineWidth={2.2}
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
  const [hovered, setHovered] = useState(false)
  const r = a * AU_SCENE
  const angle = meanMotion(periodDays) * simDays
  const x = Math.cos(angle) * r
  const z = Math.sin(angle) * r
  const selected = useSimulation((s) => s.selectedBodyId === id)
  const tour = useNewton((s) => s.tourBodyId === id)
  const hot = selected || tour || hovered

  const vDir = useMemo(() => new Vector3(-Math.sin(angle), 0, Math.cos(angle)), [angle])
  const fDir = useMemo(() => new Vector3(-x, 0, -z), [x, z])
  const vLen = 1.1 + Math.log10(1 + a) * 0.35
  const fLen = 0.7 + 0.9 / Math.sqrt(a)
  const periodYears = periodDays / 365.25

  useFrame(() => {
    if (!ref.current) return
    const target = hot ? 1.18 : 1
    const s = ref.current.scale.x
    const next = MathUtils.lerp(s, target, 0.12)
    ref.current.scale.setScalar(next)
  })

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

  return (
    <group position={[x, 0, z]}>
      <mesh
        ref={ref}
        onClick={onSelect}
        onDoubleClick={onFocus}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'grab'
        }}
      >
        <sphereGeometry args={[visualRadius, 40, 40]} />
        <meshStandardMaterial
          color={color}
          roughness={0.45}
          metalness={0.15}
          emissive={hot ? color : '#000000'}
          emissiveIntensity={hot ? 0.35 : 0.04}
        />
      </mesh>
      {/* soft atmosphere shell for selected */}
      {hot && (
        <mesh scale={1.35}>
          <sphereGeometry args={[visualRadius, 24, 24]} />
          <meshBasicMaterial color={color} transparent opacity={0.12} depthWrite={false} />
        </mesh>
      )}
      {showVelocity && <Arrow origin={[0, 0, 0]} dir={vDir} color="#7ddea8" length={vLen} />}
      {showForce && <Arrow origin={[0, 0, 0]} dir={fDir} color="#f07178" length={fLen} />}
      {(showLabel || showPeriods) && (
        <Html distanceFactor={26} style={{ pointerEvents: 'none' }}>
          <div
            style={{
              color: hot ? '#fff' : '#9eb2d4',
              fontSize: 12,
              whiteSpace: 'nowrap',
              textShadow: '0 2px 8px #000',
              transform: 'translate(-50%, 10px)',
              textAlign: 'center',
              fontWeight: hot ? 600 : 400,
            }}
          >
            {name}
            {showPeriods && (
              <div style={{ fontSize: 10, color: '#8b9bb8', fontWeight: 400 }}>
                a={a.toFixed(2)} AU · T≈
                {periodYears < 1 ? `${periodDays.toFixed(0)} d` : `${periodYears.toFixed(1)} y`}
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  )
}

function SunBody() {
  const glow = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    if (!glow.current) return
    const s = 1 + Math.sin(clock.elapsedTime * 1.4) * 0.04
    glow.current.scale.setScalar(s)
  })

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
        onPointerOver={() => {
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'grab'
        }}
      >
        <sphereGeometry args={[SUN.visualRadius, 56, 56]} />
        <meshBasicMaterial color={SUN.color} />
      </mesh>
      <mesh ref={glow} scale={2.4}>
        <sphereGeometry args={[SUN.visualRadius, 24, 24]} />
        <meshBasicMaterial color="#ffb84d" transparent opacity={0.14} depthWrite={false} />
      </mesh>
      <mesh scale={3.6}>
        <sphereGeometry args={[SUN.visualRadius, 16, 16]} />
        <meshBasicMaterial color="#ff9944" transparent opacity={0.06} depthWrite={false} />
      </mesh>
      <pointLight color="#ffd89a" intensity={140} distance={700} decay={2} />
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
  const selectedBodyId = useSimulation((s) => s.selectedBodyId)
  const tourBodyId = useNewton((s) => s.tourBodyId)
  const chapterId = useSimulation((s) => s.chapterId)
  const newtonChapter = chapterId === 'newtonian-solar-system'

  return (
    <>
      <TimeDriver />
      <SceneAtmosphere background="#050814" fogNear={80} fogFar={420} starCount={4500} />
      <SunBody />
      {PLANETS.map((p) => (
        <group key={p.id}>
          {showOrbits && (
            <OrbitRing
              radius={p.a * AU_SCENE}
              active={selectedBodyId === p.id || tourBodyId === p.id}
            />
          )}
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
    </>
  )
}

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
