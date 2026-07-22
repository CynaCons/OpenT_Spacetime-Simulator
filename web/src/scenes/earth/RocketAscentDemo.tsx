import { useFrame } from '@react-three/fiber'
import { Html, Line } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import { Group } from 'three'
import {
  altitudeKmToSceneHeight,
  EARTH_RADIUS_SCENE,
  horizonDipDeg,
} from '../../physics/earthGeometry'
import { earthLabStore, useEarthLab } from '../../state/earthLabStore'
import { FlatEarth, LaunchPadMarker, SphereEarth } from './EarthMeshes'
import { getRocketWorldPosition } from './rocketPosition'

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
      const y = hScene + 0.02
      const r = 8
      const pts: [number, number, number][] = []
      for (let i = 0; i <= 64; i++) {
        const t = (i / 64) * Math.PI * 2
        pts.push([Math.cos(t) * r, y, Math.sin(t) * r])
      }
      return pts
    }
    const R = EARTH_RADIUS_SCENE
    const rObs = R + hScene
    const dip = horizonDipDeg(altitudeKm) * (Math.PI / 180)
    const sceneDip = Math.acos(Math.min(1, R / rObs))
    const useDip = exaggerated ? sceneDip : dip
    const ringR = rObs * Math.sin(useDip)
    const ringY = rObs * Math.cos(useDip)
    const pts: [number, number, number][] = []
    for (let i = 0; i <= 96; i++) {
      const t = (i / 96) * Math.PI * 2
      pts.push([Math.cos(t) * ringR, ringY, Math.sin(t) * ringR])
    }
    return pts
  }, [altitudeKm, exaggerated, model, hScene])

  return <Line points={points} color="#f0b429" lineWidth={1.5} transparent opacity={0.85} />
}

function RocketBody() {
  const groupRef = useRef<Group>(null)
  const altitudeKm = useEarthLab((s) => s.altitudeKm)
  const exaggerated = useEarthLab((s) => s.exaggerated)
  const shapeModel = useEarthLab((s) => s.shapeModel)
  const showHorizonGuide = useEarthLab((s) => s.showHorizonGuide)

  useFrame((_, dt) => {
    earthLabStore.tickLaunch(dt)
    const { altitudeKm: alt, exaggerated: ex, shapeModel: model } = earthLabStore.getState()
    if (groupRef.current) {
      getRocketWorldPosition(alt, ex, model, groupRef.current.position)
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
      <directionalLight position={[8, 12, 4]} intensity={1.35} color="#fff2d6" />
      <directionalLight position={[-6, -2, -4]} intensity={0.3} color="#6a8cff" />

      {shapeModel === 'sphere' ? (
        <SphereEarth showGrid={showGrid} />
      ) : (
        <FlatEarth showGrid={showGrid} />
      )}
      <LaunchPadMarker model={shapeModel} />
      <RocketBody />

      {Array.from({ length: 200 }).map((_, i) => {
        const s = 40
        const x = (((i * 73) % 100) / 100) * s - s / 2
        const y = (((i * 41) % 100) / 100) * s - s / 2
        const z = (((i * 97) % 100) / 100) * s - s / 2
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
