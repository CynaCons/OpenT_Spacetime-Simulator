import { Line, OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import {
  MERCURY_A_AU,
  MERCURY_E,
  mercuryPosition,
  periapsisDirection,
  sampleEllipse,
  teachingPrecessionRadPerDay,
} from '../physics/mercury'
import { mercuryStore, useMercury } from '../state/mercuryStore'
import { SceneAtmosphere } from './shared/SceneAtmosphere'
import { SceneLabel } from './shared/SceneLabel'

/** Scene scale: AU → units (zoomed on Mercury). */
const AU_SCENE = 14
const SUN_R = 1.1
const MERCURY_R = 0.28

function Sun() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[SUN_R, 48, 48]} />
        <meshBasicMaterial color="#ffcc66" />
      </mesh>
      <pointLight color="#ffd89a" intensity={90} distance={80} decay={2} />
      <ambientLight intensity={0.18} />
      <SceneLabel position={[0, SUN_R + 0.5, 0]} color="#ffcc66" distanceFactor={18}>
        Sun
      </SceneLabel>
    </group>
  )
}

function OrbitEllipse({
  omega,
  color,
  opacity = 0.85,
  dashed = false,
}: {
  omega: number
  color: string
  opacity?: number
  dashed?: boolean
}) {
  const pts = useMemo(() => sampleEllipse(omega, AU_SCENE, 160), [omega])
  return (
    <Line
      points={pts}
      color={color}
      lineWidth={1.5}
      transparent
      opacity={opacity}
      dashed={dashed}
      dashSize={0.15}
      gapSize={0.1}
    />
  )
}

function PeriapsisMarker({
  omega,
  color,
  labelText,
}: {
  omega: number
  color: string
  labelText: string
}) {
  const [dx, , dz] = periapsisDirection(omega)
  const rPeri = MERCURY_A_AU * (1 - MERCURY_E) * AU_SCENE
  const x = dx * rPeri
  const z = dz * rPeri
  const tip = rPeri + 0.85

  return (
    <group>
      <Line
        points={[
          [0, 0, 0],
          [dx * tip, 0, dz * tip],
        ]}
        color={color}
        lineWidth={2}
        transparent
        opacity={0.9}
      />
      <mesh position={[x, 0, z]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <SceneLabel
        position={[dx * (tip + 0.4), 0.25, dz * (tip + 0.4)]}
        color={color}
        distanceFactor={16}
      >
        {labelText}
      </SceneLabel>
    </group>
  )
}

function MercuryBody({
  pos,
  color,
  name,
}: {
  pos: { x: number; y: number; z: number }
  color: string
  name: string
}) {
  return (
    <group position={[pos.x, pos.y, pos.z]}>
      <mesh>
        <sphereGeometry args={[MERCURY_R, 24, 24]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.55} />
      </mesh>
      <SceneLabel distanceFactor={14} position={[0, MERCURY_R + 0.35, 0]} color={color}>
        {name}
      </SceneLabel>
    </group>
  )
}

function RosetteTrail() {
  const trail = useMercury((s) => s.trail)
  if (trail.length < 2) return null
  return <Line points={trail} color="#c9a0ff" lineWidth={1.2} transparent opacity={0.55} />
}

function SimDriver() {
  const lastSample = useRef(0)
  useFrame((_, dt) => {
    mercuryStore.tick(dt)
    const st = mercuryStore.getState()
    if (!st.showRosette) return
    if (st.model !== 'residual' && st.model !== 'compare') return
    if (st.simDays - lastSample.current < 1.2) return
    lastSample.current = st.simDays
    const omega = teachingPrecessionRadPerDay(st.exaggeration) * st.simDays
    const p = mercuryPosition(st.simDays, omega, AU_SCENE)
    mercuryStore.pushTrailPoint([p.x, p.y, p.z])
  })
  return null
}

export function MercuryAnomalyScene() {
  const model = useMercury((s) => s.model)
  const simDays = useMercury((s) => s.simDays)
  const exaggeration = useMercury((s) => s.exaggeration)
  const showPeriapsis = useMercury((s) => s.showPeriapsis)
  const showRosette = useMercury((s) => s.showRosette)

  const omegaNewton = 0
  const omegaResidual = teachingPrecessionRadPerDay(exaggeration) * simDays

  const posNewton = useMemo(
    () => mercuryPosition(simDays, omegaNewton, AU_SCENE),
    [simDays],
  )
  const posResidual = useMemo(
    () => mercuryPosition(simDays, omegaResidual, AU_SCENE),
    [simDays, omegaResidual],
  )

  return (
    <>
      <SimDriver />
      <SceneAtmosphere background="#04070f" fogNear={25} fogFar={70} starCount={3200} />

      <Sun />

      {(model === 'newton' || model === 'compare') && (
        <OrbitEllipse
          omega={omegaNewton}
          color="#5b9dff"
          opacity={model === 'compare' ? 0.55 : 0.9}
        />
      )}

      {(model === 'residual' || model === 'compare') && (
        <OrbitEllipse omega={omegaResidual} color="#e27b58" opacity={0.95} />
      )}

      {showRosette && (model === 'residual' || model === 'compare') && <RosetteTrail />}

      {showPeriapsis && (model === 'newton' || model === 'compare') && (
        <PeriapsisMarker omega={omegaNewton} color="#5b9dff" labelText="perihelion · Newton" />
      )}
      {showPeriapsis && (model === 'residual' || model === 'compare') && (
        <PeriapsisMarker omega={omegaResidual} color="#e27b58" labelText="perihelion · residual" />
      )}

      {(model === 'newton' || model === 'compare') && (
        <MercuryBody
          pos={posNewton}
          color={model === 'compare' ? '#8ab4ff' : '#b1b1b1'}
          name={model === 'compare' ? 'Mercury · Newton' : 'Mercury'}
        />
      )}
      {(model === 'residual' || model === 'compare') && (
        <MercuryBody
          pos={posResidual}
          color="#e8c4a8"
          name={model === 'compare' ? 'Mercury · residual' : 'Mercury'}
        />
      )}

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={3}
        maxDistance={40}
        target={[0, 0, 0]}
        autoRotate
        autoRotateSpeed={0.35}
      />
    </>
  )
}
