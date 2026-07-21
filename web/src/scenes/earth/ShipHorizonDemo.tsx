import { useFrame } from '@react-three/fiber'
import { Html, Line } from '@react-three/drei'
import { useMemo, useRef, type CSSProperties } from 'react'
import { DoubleSide, Group, MathUtils } from 'three'
import {
  EARTH_RADIUS_SCENE,
  EVEREST_HEIGHT_KM,
  SURFACE_DEMO_MAX_KM,
  horizonDistanceKm,
  mutualVisibilityKm,
  spherePointFromPole,
  surfaceHeightToScene,
  surfaceKmToTeachingAngle,
} from '../../physics/earthGeometry'
import { earthLabStore, useEarthLab } from '../../state/earthLabStore'
import { FlatEarth, SphereEarth } from './EarthMeshes'

/** Eye height above water / ground (km) — ~30 m. */
export const OBSERVER_HEIGHT_KM = 0.03
/** Mast top above waterline (km) — ~25 m. */
const SHIP_MAST_KM = 0.025
/** Everest ground range from observer (km). */
export const EVEREST_DISTANCE_KM = 220

function ShipMesh({ hideHull, hideMid }: { hideHull?: boolean; hideMid?: boolean }) {
  return (
    <group>
      {!hideHull && (
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[0.3, 0.075, 0.11]} />
          <meshStandardMaterial color="#d8e2f0" metalness={0.25} roughness={0.45} />
        </mesh>
      )}
      {!hideMid && (
        <mesh position={[0, 0.11, 0]}>
          <boxGeometry args={[0.13, 0.075, 0.085]} />
          <meshStandardMaterial color="#8aa4c8" />
        </mesh>
      )}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.012, 0.014, 0.18, 8]} />
        <meshStandardMaterial color="#f0b429" emissive="#f0b429" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.028, 8, 8]} />
        <meshStandardMaterial color="#ff6b6b" emissive="#ff6b6b" emissiveIntensity={0.45} />
      </mesh>
    </group>
  )
}

function EverestMesh({ heightScene }: { heightScene: number }) {
  return (
    <group>
      <mesh position={[0, heightScene * 0.45, 0]}>
        <coneGeometry args={[heightScene * 0.55, heightScene, 6]} />
        <meshStandardMaterial color="#8a9a8a" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0, heightScene * 0.92, 0]}>
        <coneGeometry args={[heightScene * 0.18, heightScene * 0.22, 5]} />
        <meshStandardMaterial color="#f5f7fa" roughness={0.7} />
      </mesh>
    </group>
  )
}

/** Place object on teaching sphere: local +Y = radial up, path along +X. */
function placeOnSphere(group: Group, distKm: number, radialSink = 0) {
  const ang = surfaceKmToTeachingAngle(distKm)
  const R = Math.max(0.2, EARTH_RADIUS_SCENE - radialSink)
  group.position.set(Math.sin(ang) * R, Math.cos(ang) * R, 0)
  // Rotate so local +Y aligns with radial (sin, cos, 0)
  group.rotation.set(0, 0, -ang)
}

function placeOnFlat(group: Group, distKm: number, y = 0.02) {
  const x = (distKm / SURFACE_DEMO_MAX_KM) * 9
  group.position.set(x, y, 0)
  group.rotation.set(0, 0, 0)
}

function surfacePathPoints(model: 'sphere' | 'flat', steps = 80): [number, number, number][] {
  const pts: [number, number, number][] = []
  for (let i = 0; i <= steps; i++) {
    const d = (i / steps) * SURFACE_DEMO_MAX_KM
    if (model === 'sphere') {
      const p = spherePointFromPole(d)
      pts.push([p.x, p.y, p.z])
    } else {
      pts.push([(d / SURFACE_DEMO_MAX_KM) * 9, 0.015, 0])
    }
  }
  return pts
}

function horizonRingPoints(rangeKm: number, model: 'sphere' | 'flat'): [number, number, number][] {
  const d = MathUtils.clamp(rangeKm, 0, SURFACE_DEMO_MAX_KM)
  if (model === 'flat') {
    const r = (d / SURFACE_DEMO_MAX_KM) * 9
    const pts: [number, number, number][] = []
    for (let i = 0; i <= 64; i++) {
      const t = (i / 64) * Math.PI * 2
      pts.push([Math.cos(t) * r, 0.02, Math.sin(t) * r])
    }
    return pts
  }
  const ang = surfaceKmToTeachingAngle(d)
  const y = EARTH_RADIUS_SCENE * Math.cos(ang)
  const ringR = EARTH_RADIUS_SCENE * Math.sin(ang)
  const pts: [number, number, number][] = []
  for (let i = 0; i <= 96; i++) {
    const t = (i / 96) * Math.PI * 2
    pts.push([Math.cos(t) * ringR, y, Math.sin(t) * ringR])
  }
  return pts
}

function clipRayAgainstSphere(
  eye: [number, number, number],
  end: [number, number, number],
  R: number,
): [number, number, number] {
  const [ox, oy, oz] = eye
  const dx = end[0] - ox
  const dy = end[1] - oy
  const dz = end[2] - oz
  const a = dx * dx + dy * dy + dz * dz
  const b = 2 * (ox * dx + oy * dy + oz * dz)
  const c = ox * ox + oy * oy + oz * oz - R * R
  const disc = b * b - 4 * a * c
  if (disc < 0 || a < 1e-12) return end
  const s = Math.sqrt(disc)
  const t1 = (-b - s) / (2 * a)
  const t2 = (-b + s) / (2 * a)
  let t = Infinity
  if (t1 > 1e-4 && t1 <= 1) t = t1
  if (t2 > 1e-4 && t2 <= 1 && t2 < t) t = t2
  if (!Number.isFinite(t) || t > 1) return end
  const u = t * 0.995
  return [ox + dx * u, oy + dy * u, oz + dz * u]
}

function shipHideFraction(shipDistKm: number, observerHeightKm: number, mastKm: number) {
  const mastVisibleRange = mutualVisibilityKm(observerHeightKm, mastKm)
  const hullVisibleRange = mutualVisibilityKm(observerHeightKm, 0.004)
  const midVisibleRange = mutualVisibilityKm(observerHeightKm, 0.012)
  return {
    hull: shipDistKm > hullVisibleRange,
    mid: shipDistKm > midVisibleRange,
    fullyGone: shipDistKm > mastVisibleRange * 1.02,
    mastRange: mastVisibleRange,
    hullRange: hullVisibleRange,
  }
}

function eyePosition(model: 'sphere' | 'flat'): [number, number, number] {
  const eyeH = surfaceHeightToScene(OBSERVER_HEIGHT_KM, true)
  if (model === 'sphere') return [0, EARTH_RADIUS_SCENE + eyeH, 0]
  return [0, eyeH, 0]
}

function buildFovRays(model: 'sphere' | 'flat', observerHeightKm: number, fovDeg: number) {
  const eye = eyePosition(model)
  const horizonKm = horizonDistanceKm(observerHeightKm)
  const half = (fovDeg * Math.PI) / 180 / 2
  const rays: Array<[number, number, number][]> = []

  // Fan of look directions in path plane (and slight Z for volume)
  const samples = [-1, -0.5, 0, 0.5, 1]
  for (const s of samples) {
    const aimKm = MathUtils.clamp(horizonKm * (0.55 + s * 0.35), 4, SURFACE_DEMO_MAX_KM * 0.95)
    const a = s * half
    let end: [number, number, number]
    if (model === 'sphere') {
      const p = spherePointFromPole(aimKm)
      // offset in longitude for wedge feel
      const ang = surfaceKmToTeachingAngle(aimKm)
      const ringR = EARTH_RADIUS_SCENE * Math.sin(ang)
      const y = EARTH_RADIUS_SCENE * Math.cos(ang)
      end = [ringR * Math.cos(a * 0.35), y, ringR * Math.sin(a * 0.35)]
      // blend toward path for center ray
      if (Math.abs(s) < 0.01) end = [p.x * 1.001, p.y * 1.001, p.z]
      end = clipRayAgainstSphere(eye, end, EARTH_RADIUS_SCENE * 0.999)
    } else {
      end = [(aimKm / SURFACE_DEMO_MAX_KM) * 9, 0.04, Math.sin(a) * 1.4]
    }
    rays.push([eye, end])
  }

  // Bold horizon tangent
  let horizonEnd: [number, number, number]
  if (model === 'sphere') {
    const p = spherePointFromPole(horizonKm)
    horizonEnd = [p.x, p.y, p.z]
  } else {
    horizonEnd = [(horizonKm / SURFACE_DEMO_MAX_KM) * 9, 0.02, 0]
  }

  return { rays, horizonRay: [eye, horizonEnd] as [[number, number, number], [number, number, number]], eye }
}

export function ShipHorizonDemo() {
  const shapeModel = useEarthLab((s) => s.shapeModel)
  const showGrid = useEarthLab((s) => s.showGrid)
  const shipDistanceKm = useEarthLab((s) => s.shipDistanceKm)
  const showFov = useEarthLab((s) => s.showFov)
  const shipRef = useRef<Group>(null)
  const everestRef = useRef<Group>(null)

  const eyeHorizonKm = horizonDistanceKm(OBSERVER_HEIGHT_KM)
  const everestVisKm = mutualVisibilityKm(OBSERVER_HEIGHT_KM, EVEREST_HEIGHT_KM)
  const everestFromSummitKm = horizonDistanceKm(EVEREST_HEIGHT_KM)
  const hide = shipHideFraction(shipDistanceKm, OBSERVER_HEIGHT_KM, SHIP_MAST_KM)

  const pathPts = useMemo(() => surfacePathPoints(shapeModel), [shapeModel])
  const horizonPts = useMemo(
    () => horizonRingPoints(eyeHorizonKm, shapeModel),
    [eyeHorizonKm, shapeModel],
  )
  const everestVisRing = useMemo(
    () => horizonRingPoints(Math.min(everestVisKm, SURFACE_DEMO_MAX_KM), shapeModel),
    [everestVisKm, shapeModel],
  )
  const fov = useMemo(
    () => buildFovRays(shapeModel, OBSERVER_HEIGHT_KM, 55),
    [shapeModel],
  )

  const losPoints = useMemo(() => {
    const eye = eyePosition(shapeModel)
    if (shapeModel === 'sphere') {
      const ang = surfaceKmToTeachingAngle(shipDistanceKm)
      const mastScene = surfaceHeightToScene(SHIP_MAST_KM, true)
      const R = EARTH_RADIUS_SCENE + mastScene
      const end: [number, number, number] = [Math.sin(ang) * R, Math.cos(ang) * R, 0]
      if (hide.fullyGone) {
        return [eye, clipRayAgainstSphere(eye, end, EARTH_RADIUS_SCENE * 0.999)] as const
      }
      return [eye, end] as const
    }
    const x = (shipDistanceKm / SURFACE_DEMO_MAX_KM) * 9
    return [eye, [x, surfaceHeightToScene(SHIP_MAST_KM, true), 0] as [number, number, number]] as const
  }, [shapeModel, shipDistanceKm, hide.fullyGone])

  useFrame((_, dt) => {
    earthLabStore.tickShip(dt)
    const { shipDistanceKm: d, shapeModel: model } = earthLabStore.getState()
    const hideNow = shipHideFraction(d, OBSERVER_HEIGHT_KM, SHIP_MAST_KM)

    if (shipRef.current) {
      if (model === 'sphere') {
        let sink = 0
        if (hideNow.hull) sink += 0.04
        if (hideNow.mid) sink += 0.05
        if (hideNow.fullyGone) sink += 0.2
        placeOnSphere(shipRef.current, d, sink)
        shipRef.current.visible = !hideNow.fullyGone
      } else {
        placeOnFlat(shipRef.current, d, 0.02)
        shipRef.current.visible = true
      }
    }

    if (everestRef.current) {
      if (model === 'sphere') {
        placeOnSphere(everestRef.current, EVEREST_DISTANCE_KM, 0)
      } else {
        placeOnFlat(everestRef.current, EVEREST_DISTANCE_KM, 0)
      }
    }
  })

  const everestVisible = shapeModel === 'flat' || EVEREST_DISTANCE_KM <= everestVisKm * 1.02
  const everestHScene = surfaceHeightToScene(EVEREST_HEIGHT_KM, true)

  return (
    <>
      <color attach="background" args={['#050a14']} />
      <ambientLight intensity={0.42} />
      <directionalLight position={[6, 10, 4]} intensity={1.25} />
      <directionalLight position={[-4, 2, -6]} intensity={0.3} color="#6a8cff" />

      {shapeModel === 'sphere' ? (
        <SphereEarth showGrid={showGrid} />
      ) : (
        <FlatEarth showGrid={showGrid} />
      )}

      {/* Track along surface */}
      <Line points={pathPts} color="#5b9dff" lineWidth={2} transparent opacity={0.65} />

      {/* Eye-level geometric horizon */}
      <Line points={horizonPts} color="#f0b429" lineWidth={2.5} transparent opacity={0.95} />

      {/* Mutual visibility range (eye ↔ Everest summit) */}
      <Line points={everestVisRing} color="#7ddea8" lineWidth={2} transparent opacity={0.65} />

      {/* Observer */}
      <mesh position={eyePosition(shapeModel)}>
        <sphereGeometry args={[0.075, 16, 16]} />
        <meshStandardMaterial color="#f0b429" emissive="#f0b429" emissiveIntensity={0.55} />
      </mesh>
      <Html
        position={
          shapeModel === 'sphere'
            ? [0.2, EARTH_RADIUS_SCENE + 0.35, 0.1]
            : [0.25, 0.4, 0]
        }
        distanceFactor={9}
        style={{ pointerEvents: 'none' }}
      >
        <div style={labelStyle('#f0b429')}>
          Eye · {Math.round(OBSERVER_HEIGHT_KM * 1000)} m ASL
          <br />
          sea horizon ≈ {eyeHorizonKm.toFixed(1)} km
        </div>
      </Html>

      {/* Field of view */}
      {showFov &&
        fov.rays.map((ray, i) => (
          <Line
            key={`fov-${i}`}
            points={ray}
            color={i === 2 ? '#b8d4ff' : '#4a6a9a'}
            lineWidth={i === 2 ? 2 : 1}
            transparent
            opacity={i === 2 ? 0.9 : 0.4}
          />
        ))}
      {showFov && (
        <Line
          points={fov.horizonRay}
          color="#f0b429"
          lineWidth={3}
          transparent
          opacity={1}
        />
      )}
      {showFov && shapeModel === 'sphere' && (
        <FovWedgeMesh horizonKm={eyeHorizonKm} fovDeg={55} />
      )}

      {/* Line of sight to ship mast */}
      <Line
        points={[...losPoints]}
        color={hide.fullyGone && shapeModel === 'sphere' ? '#f07178' : '#e0f0ff'}
        lineWidth={2.5}
        transparent
        opacity={0.95}
        dashed={hide.fullyGone && shapeModel === 'sphere'}
        dashSize={0.1}
        gapSize={0.07}
      />

      {/* Ship */}
      <group ref={shipRef}>
        <ShipMesh
          hideHull={shapeModel === 'sphere' && hide.hull}
          hideMid={shapeModel === 'sphere' && hide.mid}
        />
        <Html distanceFactor={7} position={[0.14, 0.34, 0]} style={{ pointerEvents: 'none' }}>
          <div
            style={labelStyle(
              shapeModel === 'sphere' && hide.hull ? '#f07178' : '#e8eefc',
            )}
          >
            Ship · {shipDistanceKm.toFixed(0)} km
            {shapeModel === 'sphere' && hide.hull && !hide.fullyGone
              ? ' · hull under horizon'
              : ''}
            {shapeModel === 'sphere' && hide.fullyGone ? ' · gone behind curve' : ''}
          </div>
        </Html>
      </group>

      {shapeModel === 'sphere' && hide.fullyGone && (
        <Html
          position={[
            Math.sin(surfaceKmToTeachingAngle(shipDistanceKm)) * EARTH_RADIUS_SCENE * 1.03,
            Math.cos(surfaceKmToTeachingAngle(shipDistanceKm)) * EARTH_RADIUS_SCENE * 1.03,
            0,
          ]}
          distanceFactor={10}
          style={{ pointerEvents: 'none' }}
        >
          <div style={labelStyle('#f07178')}>Occluded by Earth&apos;s curve</div>
        </Html>
      )}

      {/* Everest */}
      <group ref={everestRef}>
        <EverestMesh heightScene={everestHScene} />
        <Html
          distanceFactor={8}
          position={[0.12, everestHScene + 0.18, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <div style={labelStyle(everestVisible ? '#7ddea8' : '#f07178')}>
            Everest · {EVEREST_HEIGHT_KM.toFixed(2)} km high
            <br />
            {EVEREST_DISTANCE_KM} km from eye
            <br />
            {shapeModel === 'sphere'
              ? everestVisible
                ? `Summit visible (limit ≈ ${everestVisKm.toFixed(0)} km)`
                : `Hidden (limit ≈ ${everestVisKm.toFixed(0)} km)`
              : 'Always “visible” on a flat disk'}
          </div>
        </Html>
      </group>

      {/* Range labels */}
      <Html
        position={markerPos(shapeModel, eyeHorizonKm, 1.05)}
        distanceFactor={11}
        style={{ pointerEvents: 'none' }}
      >
        <div style={labelStyle('#f0b429')}>
          Gold ring · eye horizon ≈ {eyeHorizonKm.toFixed(1)} km
        </div>
      </Html>
      <Html
        position={markerPos(shapeModel, Math.min(everestVisKm, SURFACE_DEMO_MAX_KM), 1.08)}
        distanceFactor={11}
        style={{ pointerEvents: 'none' }}
      >
        <div style={labelStyle('#7ddea8')}>
          Green ring · Everest still visible ≈ {everestVisKm.toFixed(0)} km
          <br />
          <span style={{ fontSize: 10, opacity: 0.9 }}>
            (summit alone sees ≈ {everestFromSummitKm.toFixed(0)} km of sea)
          </span>
        </div>
      </Html>
    </>
  )
}

function markerPos(
  model: 'sphere' | 'flat',
  distKm: number,
  scale: number,
): [number, number, number] {
  if (model === 'flat') {
    return [(distKm / SURFACE_DEMO_MAX_KM) * 9, 0.35, 0]
  }
  const p = spherePointFromPole(distKm)
  return [p.x * scale, p.y * scale, p.z]
}

function FovWedgeMesh({ horizonKm, fovDeg }: { horizonKm: number; fovDeg: number }) {
  const positions = useMemo(() => {
    const eye = eyePosition('sphere')
    const ang = surfaceKmToTeachingAngle(horizonKm)
    const half = ((fovDeg * Math.PI) / 180) * 0.5
    const arr: number[] = []
    const segs = 28
    for (let i = 0; i < segs; i++) {
      const a0 = -half + (i / segs) * 2 * half
      const a1 = -half + ((i + 1) / segs) * 2 * half
      const ringR = EARTH_RADIUS_SCENE * Math.sin(ang)
      const y = EARTH_RADIUS_SCENE * Math.cos(ang)
      const p0x = ringR * Math.cos(a0)
      const p0z = ringR * Math.sin(a0)
      const p1x = ringR * Math.cos(a1)
      const p1z = ringR * Math.sin(a1)
      arr.push(eye[0], eye[1], eye[2], p0x, y, p0z, p1x, y, p1z)
    }
    return new Float32Array(arr)
  }, [horizonKm, fovDeg])

  return (
    <mesh renderOrder={-1}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <meshBasicMaterial
        color="#5b9dff"
        transparent
        opacity={0.14}
        side={DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}

function labelStyle(color: string): CSSProperties {
  return {
    color,
    fontSize: 11,
    lineHeight: 1.35,
    textShadow: '0 1px 4px #000',
    whiteSpace: 'nowrap',
    background: '#0a1220cc',
    padding: '3px 7px',
    borderRadius: 4,
    border: `1px solid ${color}55`,
  }
}
