import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import { Group, Vector3 } from 'three'
import {
  EARTH_RADIUS_KM,
  EARTH_RADIUS_SCENE,
  horizonDistanceKm,
} from '../../physics/earthGeometry'
import { earthLabStore, useEarthLab } from '../../state/earthLabStore'
import { FlatEarth, SphereEarth } from './EarthMeshes'

const OBSERVER_HEIGHT_KM = 0.03 // ~30 m tower / eye height (pedagogical)

function ShipMesh({ color = '#e8eef8' }: { color?: string }) {
  return (
    <group>
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[0.22, 0.06, 0.08]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.08, 0.08, 0.06]} />
        <meshStandardMaterial color="#5b9dff" />
      </mesh>
    </group>
  )
}

/**
 * Place a point at surface distance `distKm` east of north-pole observer on a sphere.
 * Uses angular distance δ = dist / R.
 */
function sphereSurfacePoint(distKm: number, radiusScene: number): Vector3 {
  const ang = distKm / EARTH_RADIUS_KM
  // Start at north pole; move toward +X
  const x = radiusScene * Math.sin(ang)
  const y = radiusScene * Math.cos(ang)
  return new Vector3(x, y, 0)
}

export function ShipHorizonDemo() {
  const shapeModel = useEarthLab((s) => s.shapeModel)
  const showGrid = useEarthLab((s) => s.showGrid)
  const shipDistanceKm = useEarthLab((s) => s.shipDistanceKm)
  const shipRef = useRef<Group>(null)
  const horizonKm = useMemo(
    () => horizonDistanceKm(OBSERVER_HEIGHT_KM),
    [],
  )

  useFrame((_, dt) => {
    earthLabStore.tickShip(dt)
    const { shipDistanceKm: d, shapeModel: model } = earthLabStore.getState()
    if (!shipRef.current) return

    if (model === 'sphere') {
      const p = sphereSurfacePoint(d, EARTH_RADIUS_SCENE)
      // Ship sits on surface; if beyond geometric horizon from pole observer,
      // it is occluded by the sphere (we lower it slightly for clear “gone” cue when far).
      const beyond = d > horizonKm
      shipRef.current.position.copy(p)
      // orient roughly upright
      shipRef.current.lookAt(0, 0, 0)
      shipRef.current.rotateX(-Math.PI / 2)
      // visual: sink slightly when over horizon (occlusion also hides it behind limb)
      if (beyond) {
        shipRef.current.position.multiplyScalar(0.992)
      }
    } else {
      // Flat: ship recedes on plane; always above plane, only shrinks with distance
      const scale = EARTH_RADIUS_SCENE / 500 // km → scene
      shipRef.current.position.set(d * scale, 0.06, 0)
      shipRef.current.rotation.set(0, 0, 0)
    }
  })

  // Observer camera fixed at north pole / center of flat pad
  useFrame((state) => {
    const model = earthLabStore.getState().shapeModel
    const cam = state.camera
    if (model === 'sphere') {
      const eye = EARTH_RADIUS_SCENE + 0.08
      cam.position.set(0.15, eye, 0.55)
      // look toward ship direction (+X)
      cam.lookAt(2.5, EARTH_RADIUS_SCENE * 0.85, 0)
    } else {
      cam.position.set(-0.3, 0.35, 1.2)
      cam.lookAt(2, 0.1, 0)
    }
  })

  const beyond = shipDistanceKm > horizonKm
  const scaleHint = Math.max(0.35, 1 - shipDistanceKm / 500)

  return (
    <>
      <color attach="background" args={['#050a14']} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[6, 10, 4]} intensity={1.2} />

      {shapeModel === 'sphere' ? <SphereEarth showGrid={showGrid} /> : <FlatEarth showGrid={showGrid} />}

      {/* observer marker */}
      <mesh
        position={
          shapeModel === 'sphere'
            ? [0, EARTH_RADIUS_SCENE + 0.05, 0]
            : [0, 0.08, 0]
        }
      >
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#f0b429" emissive="#f0b429" emissiveIntensity={0.4} />
      </mesh>

      <group ref={shipRef} scale={scaleHint * (shapeModel === 'flat' ? 1.4 : 1)}>
        <ShipMesh color={beyond && shapeModel === 'sphere' ? '#667' : '#e8eef8'} />
        <Html distanceFactor={6} position={[0, 0.2, 0]} style={{ pointerEvents: 'none' }}>
          <div
            style={{
              color: beyond && shapeModel === 'sphere' ? '#f07178' : '#cde',
              fontSize: 11,
              textShadow: '0 1px 3px #000',
              whiteSpace: 'nowrap',
            }}
          >
            Ship · {shipDistanceKm.toFixed(0)} km
            {shapeModel === 'sphere' && beyond ? ' · below horizon' : ''}
          </div>
        </Html>
      </group>

      {/* horizon distance marker on sphere (angular) */}
      {shapeModel === 'sphere' && (
        <HorizonMarker horizonKm={horizonKm} />
      )}
    </>
  )
}

function HorizonMarker({ horizonKm }: { horizonKm: number }) {
  const p = useMemo(
    () => sphereSurfacePoint(horizonKm, EARTH_RADIUS_SCENE),
    [horizonKm],
  )
  const labelPos = useMemo(() => p.clone().multiplyScalar(1.03), [p])

  return (
    <group>
      <mesh position={p}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#f0b429" />
      </mesh>
      <Html position={labelPos} distanceFactor={10} style={{ pointerEvents: 'none' }}>
        <div style={{ color: '#f0b429', fontSize: 10, textShadow: '0 1px 3px #000' }}>
          Horizon ≈ {horizonKm.toFixed(1)} km
        </div>
      </Html>
    </group>
  )
}
