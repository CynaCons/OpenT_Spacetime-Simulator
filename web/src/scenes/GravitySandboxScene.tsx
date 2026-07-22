import { OrbitControls, Line } from '@react-three/drei'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { useMemo, type ReactNode } from 'react'
import { escapeSpeed } from '../physics/newton'
import { newtonStore, useNewton, type SandboxBody } from '../state/newtonStore'
import { SceneAtmosphere } from './shared/SceneAtmosphere'

function BodyMesh({
  body,
  selected,
}: {
  body: SandboxBody
  selected: boolean
}) {
  const r = body.fixed ? 0.55 + Math.log10(body.mass + 1) * 0.25 : 0.18 + body.mass * 0.06
  return (
    <group position={[body.x, body.y, body.z]}>
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          newtonStore.selectSandbox(body.id)
        }}
      >
        <sphereGeometry args={[r, 24, 24]} />
        {body.fixed ? (
          <meshBasicMaterial color={body.color} />
        ) : (
          <meshStandardMaterial
            color={body.color}
            emissive={selected ? body.color : '#000'}
            emissiveIntensity={selected ? 0.35 : 0}
          />
        )}
      </mesh>
      {body.fixed && <pointLight color="#ffd89a" intensity={40} distance={80} decay={2} />}
      {/* velocity arrow */}
      {!body.fixed && (Math.abs(body.vx) + Math.abs(body.vz) > 0.01) && (
        <Line
          points={[
            [0, 0, 0],
            [body.vx * 0.45, body.vy * 0.45, body.vz * 0.45],
          ]}
          color="#7ddea8"
          lineWidth={2}
        />
      )}
    </group>
  )
}

function Trails({ bodies }: { bodies: SandboxBody[] }) {
  return (
    <>
      {bodies.map((b) =>
        b.trail.length > 1 ? (
          <Line
            key={`trail-${b.id}`}
            points={b.trail}
            color={b.color}
            lineWidth={1}
            transparent
            opacity={0.55}
          />
        ) : null,
      )}
    </>
  )
}

function ForceLines({ bodies, G }: { bodies: SandboxBody[]; G: number }) {
  // Show force on selected body toward each other mass
  const selectedId = useNewton((s) => s.selectedSandboxId)
  const sel = bodies.find((b) => b.id === selectedId)
  if (!sel || sel.fixed) return null

  const lines: ReactNode[] = []
  for (const other of bodies) {
    if (other.id === sel.id) continue
    const dx = other.x - sel.x
    const dy = other.y - sel.y
    const dz = other.z - sel.z
    const r2 = dx * dx + dy * dy + dz * dz + 0.15
    const r = Math.sqrt(r2)
    const f = (G * other.mass) / r2
    const scale = Math.min(2.5, f * 0.35)
    const ex = sel.x + (dx / r) * scale
    const ey = sel.y + (dy / r) * scale
    const ez = sel.z + (dz / r) * scale
    lines.push(
      <Line
        key={`f-${other.id}`}
        points={[
          [sel.x, sel.y, sel.z],
          [ex, ey, ez],
        ]}
        color="#f07178"
        lineWidth={2}
      />,
    )
  }
  return <>{lines}</>
}

function ClickPlane() {
  const placeMode = useNewton((s) => s.placeMode)
  const planeY = 0

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (!placeMode) return
    e.stopPropagation()
    const rectHit = e.point
    newtonStore.addBodyAt(rectHit.x, planeY, rectHit.z, placeMode)
  }

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, planeY, 0]}
      onPointerDown={onPointerDown}
      visible={!!placeMode}
    >
      <planeGeometry args={[80, 80]} />
      <meshBasicMaterial
        color="#5b9dff"
        transparent
        opacity={placeMode ? 0.06 : 0}
        depthWrite={false}
      />
    </mesh>
  )
}

export function GravitySandboxScene() {
  const bodies = useNewton((s) => s.sandboxBodies)
  const G = useNewton((s) => s.sandboxG)
  const selectedId = useNewton((s) => s.selectedSandboxId)
  const showForce = useNewton((s) => s.showForce)
  const trails = useNewton((s) => s.sandboxTrails)

  useFrame((_, dt) => {
    // clamp dt for stability
    const step = Math.min(dt, 0.05) * 1.8
    newtonStore.tickSandbox(step)
  })

  const central = bodies.find((b) => b.fixed)
  const selected = bodies.find((b) => b.id === selectedId)

  const escapeHint = useMemo(() => {
    if (!central || !selected || selected.fixed) return null
    const r = Math.hypot(selected.x - central.x, selected.z - central.z)
    const v = Math.hypot(selected.vx, selected.vz)
    const vesc = escapeSpeed(G, central.mass, r)
    return { r, v, vesc, bound: v < vesc }
  }, [central, selected, G])

  return (
    <>
      <SceneAtmosphere background="#03060f" fogNear={30} fogFar={80} starCount={2800} />

      <gridHelper args={[40, 40, '#2a4a72', '#0e1a2c']} />
      <ClickPlane />

      {trails && <Trails bodies={bodies} />}
      {showForce && <ForceLines bodies={bodies} G={G} />}
      {bodies.map((b) => (
        <BodyMesh key={b.id} body={b} selected={b.id === selectedId} />
      ))}

      {escapeHint && selected && (
        <Line
          points={[
            [selected.x, 0.05, selected.z],
            [
              selected.x + selected.vx * 0.5,
              0.05,
              selected.z + selected.vz * 0.5,
            ],
          ]}
          color={escapeHint.bound ? '#7ddea8' : '#f07178'}
          lineWidth={2}
        />
      )}

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={2}
        maxDistance={60}
        target={[0, 0, 0]}
      />
    </>
  )
}

export function sandboxEscapeInfo() {
  const s = newtonStore.getState()
  const central = s.sandboxBodies.find((b) => b.fixed)
  const selected = s.sandboxBodies.find((b) => b.id === s.selectedSandboxId)
  if (!central || !selected || selected.fixed) return null
  const r = Math.hypot(selected.x - central.x, selected.z - central.z)
  const v = Math.hypot(selected.vx, selected.vz)
  const vesc = escapeSpeed(s.sandboxG, central.mass, r)
  return { r, v, vesc, bound: v < vesc * 0.99 }
}
