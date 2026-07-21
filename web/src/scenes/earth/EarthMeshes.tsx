import { useMemo } from 'react'
import { DoubleSide } from 'three'
import { EARTH_RADIUS_SCENE } from '../../physics/earthGeometry'
import { createEarthTexture, createFlatMapTexture } from './createEarthTexture'

export function SphereEarth({ showGrid }: { showGrid: boolean }) {
  const texture = useMemo(() => createEarthTexture(1024), [])

  return (
    <group>
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS_SCENE, 64, 64]} />
        <meshStandardMaterial map={texture} roughness={0.85} metalness={0.05} />
      </mesh>
      {/* thin atmosphere shell */}
      <mesh scale={1.025}>
        <sphereGeometry args={[EARTH_RADIUS_SCENE, 48, 48]} />
        <meshBasicMaterial color="#6eb6ff" transparent opacity={0.1} side={DoubleSide} />
      </mesh>
      {showGrid && (
        <mesh>
          <sphereGeometry args={[EARTH_RADIUS_SCENE * 1.002, 36, 18]} />
          <meshBasicMaterial color="#9ec9ff" wireframe transparent opacity={0.18} />
        </mesh>
      )}
    </group>
  )
}

/** Flat-disk “Earth” with same texture for A/B comparison. */
export function FlatEarth({ showGrid }: { showGrid: boolean }) {
  const texture = useMemo(() => createFlatMapTexture(1024), [])
  const radius = EARTH_RADIUS_SCENE * 2.4

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[radius, 96]} />
        <meshStandardMaterial map={texture} roughness={0.9} metalness={0.02} side={DoubleSide} />
      </mesh>
      {/* underside */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <circleGeometry args={[radius, 64]} />
        <meshStandardMaterial color="#1a2740" side={DoubleSide} />
      </mesh>
      {showGrid && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[radius * 0.2, radius, 64]} />
          <meshBasicMaterial color="#9ec9ff" wireframe transparent opacity={0.2} />
        </mesh>
      )}
      {/* edge marker so “horizon” is the disk rim */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry args={[radius * 0.98, radius, 96]} />
        <meshBasicMaterial color="#f0b429" transparent opacity={0.55} side={DoubleSide} />
      </mesh>
    </group>
  )
}

export function LaunchPadMarker({ model }: { model: 'sphere' | 'flat' }) {
  if (model === 'flat') {
    return (
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 0.08, 16]} />
        <meshStandardMaterial color="#cfd8e8" emissive="#445" emissiveIntensity={0.2} />
      </mesh>
    )
  }
  // North-pole pad on sphere
  return (
    <mesh position={[0, EARTH_RADIUS_SCENE + 0.04, 0]}>
      <cylinderGeometry args={[0.1, 0.12, 0.06, 16]} />
      <meshStandardMaterial color="#cfd8e8" emissive="#445" emissiveIntensity={0.2} />
    </mesh>
  )
}
