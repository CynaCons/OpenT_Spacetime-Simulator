import { useFrame } from '@react-three/fiber'
import { Html, Line } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import { Group, Vector3 } from 'three'
import {
  altitudeKmToSceneHeight,
  EARTH_RADIUS_SCENE,
  horizonDipDeg,
} from '../../physics/earthGeometry'
import { earthLabStore, useEarthLab } from '../../state/earthLabStore'
import { FlatEarth, LaunchPadMarker, SphereEarth } from './EarthMeshes'

const _up = new Vector3()
const _pos = new Vector3()
const _look = new Vector3()
const _side = new Vector3()

function RocketMesh() {
  return (
    <group>
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.05, 0.07, 0.45, 12]} />
        <meshStandardMaterial color="#e8eef8" metalness={0.4} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <coneGeometry args={[0.07, 0.16, 12]} />
        <meshStandardMaterial color="#e27b58" />
      </mesh>
      <mesh position={[0, -0.05, 0]}>
        <coneGeometry args={[0.09, 0.12, 10]} />
        <meshStandardMaterial color="#5b9dff" emissive="#2a6ad4" emissiveIntensity={0.6} />
      </mesh>
    </group>
  )
}

function HorizonGuide({
  altitudeKm,
  exaggerated,
  model,
}: {
  altitudeKm: number
  exaggerated: boolean
  model: 'sphere' | 'flat'
}) {
  const hScene = altitudeKmToSceneHeight(altitudeKm, exaggerated)
  const points = useMemo(() => {
    if (model === 'flat') {
      // On flat model, draw a “level horizon” ring at eye height — stays flat
      const y = hScene + 0.02
      const r = 8
      const pts: [number, number, number][] = []
      for (let i = 0; i <= 64; i++) {
        const t = (i / 64) * Math.PI * 2
        pts.push([Math.cos(t) * r, y, Math.sin(t) * r])
      }
      return pts
    }
    // Sphere: approximate geometric horizon ring in a plane dipped below local horizontal
    const R = EARTH_RADIUS_SCENE
    const rObs = R + hScene
    const dip = horizonDipDeg(altitudeKm) * (Math.PI / 180)
    // teaching: if exaggerated heights, use scene-consistent dip from scene geometry
    const sceneDip = Math.acos(Math.min(1, R / rObs))
    const useDip = exaggerated ? sceneDip : dip
    const ringR = rObs * Math.sin(useDip)
    const ringY = rObs * Math.cos(useDip)
    // ring in plane y = ringY for north-pole observer (centered on axis)
    const pts: [number, number, number][] = []
    for (let i = 0; i <= 96; i++) {
      const t = (i / 96) * Math.PI * 2
      pts.push([Math.cos(t) * ringR, ringY, Math.sin(t) * ringR])
    }
    return pts
  }, [altitudeKm, exaggerated, model, hScene])

  return <Line points={points} color="#f0b429" lineWidth={1.5} transparent opacity={0.85} />
}

function RocketAndCamera() {
  const groupRef = useRef<Group>(null)
  const altitudeKm = useEarthLab((s) => s.altitudeKm)
  const exaggerated = useEarthLab((s) => s.exaggerated)
  const shapeModel = useEarthLab((s) => s.shapeModel)
  const showHorizonGuide = useEarthLab((s) => s.showHorizonGuide)

  useFrame((state, dt) => {
    earthLabStore.tickLaunch(dt)
    const { altitudeKm: alt, exaggerated: ex, shapeModel: model, lookMode: look } =
      earthLabStore.getState()
    const h = altitudeKmToSceneHeight(alt, ex)

    if (model === 'flat') {
      _pos.set(0, h, 0)
      _up.set(0, 1, 0)
    } else {
      // Launch from north pole along +Y
      _pos.set(0, EARTH_RADIUS_SCENE + h, 0)
      _up.set(0, 1, 0)
    }

    if (groupRef.current) {
      groupRef.current.position.copy(_pos)
    }

    const cam = state.camera
    if (look === 'orbit') {
      // leave OrbitControls free — do not fight camera
      return
    }

    if (look === 'nadir') {
      // slightly off-axis so we don't look through the rocket
      cam.position.copy(_pos).addScaledVector(_up, 0.35).add(new Vector3(0.4, 0, 0.15))
      cam.lookAt(_pos.x * 0.2, model === 'flat' ? 0 : 0, _pos.z)
      if (model === 'sphere') {
        cam.lookAt(0, 0, 0)
      } else {
        cam.lookAt(0, 0, 0)
      }
      return
    }

    // horizon ride: behind rocket, looking toward local horizon
    _side.set(1, 0, 0)
    const back = 0.55
    const upOff = 0.12
    cam.position.copy(_pos).addScaledVector(_up, upOff).addScaledVector(_side, 0.05)
    cam.position.z += back

    if (model === 'sphere') {
      const R = EARTH_RADIUS_SCENE
      const rObs = R + h
      const sceneDip = Math.acos(Math.min(1, R / Math.max(rObs, R + 1e-6)))
      // Look toward a point on the geometric horizon in the +X direction
      const ringY = rObs * Math.cos(sceneDip)
      const ringR = rObs * Math.sin(sceneDip)
      _look.set(ringR, ringY, 0)
      cam.lookAt(_look)
    } else {
      // Flat: look horizontally outward — horizon never “curves”
      _look.set(12, h, 0)
      cam.lookAt(_look)
    }
  })

  return (
    <>
      <group ref={groupRef}>
        <RocketMesh />
        <Html distanceFactor={8} position={[0.15, 0.35, 0]} style={{ pointerEvents: 'none' }}>
          <div
            style={{
              color: '#e8eefc',
              fontSize: 11,
              textShadow: '0 1px 3px #000',
              whiteSpace: 'nowrap',
            }}
          >
            Rocket · {altitudeKm.toFixed(0)} km
          </div>
        </Html>
      </group>
      {showHorizonGuide && (
        <HorizonGuide altitudeKm={altitudeKm} exaggerated={exaggerated} model={shapeModel} />
      )}
    </>
  )
}

export function RocketAscentDemo() {
  const shapeModel = useEarthLab((s) => s.shapeModel)
  const showGrid = useEarthLab((s) => s.showGrid)

  return (
    <>
      <color attach="background" args={['#02060f']} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[8, 12, 4]} intensity={1.35} color="#fff2d6" />
      <directionalLight position={[-6, -2, -4]} intensity={0.25} color="#6a8cff" />

      {shapeModel === 'sphere' ? <SphereEarth showGrid={showGrid} /> : <FlatEarth showGrid={showGrid} />}
      <LaunchPadMarker model={shapeModel} />
      <RocketAndCamera />

      {/* stars */}
      {Array.from({ length: 200 }).map((_, i) => {
        const s = 40
        const x = ((i * 73) % 100) / 100 * s - s / 2
        const y = ((i * 41) % 100) / 100 * s - s / 2
        const z = ((i * 97) % 100) / 100 * s - s / 2
        if (x * x + y * y + z * z < 12 * 12) return null
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.03, 4, 4]} />
            <meshBasicMaterial color="#cde" />
          </mesh>
        )
      })}
    </>
  )
}
