import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { Vector3 } from 'three'
import { getBodyPosition } from '../physics/solarSystemData'
import { simulationStore, useSimulation } from '../state/simulationStore'

const DEFAULT_OFFSET = new Vector3(0, 28, 42)
const _target = new Vector3()
const _offset = new Vector3()

function resolveTarget(
  focusMode: string,
  focusBodyId: string | null,
  freeTarget: [number, number, number],
  simDays: number,
): [number, number, number] {
  if (focusMode === 'sun') return [0, 0, 0]
  if (focusMode === 'earth') return getBodyPosition('earth', simDays)
  if (focusMode === 'body' && focusBodyId) return getBodyPosition(focusBodyId, simDays)
  return freeTarget
}

/**
 * Controllable orbit/zoom center:
 * - Sun / Earth / body: camera target follows that object
 * - Free: pan (right-click) moves the center; then scroll to re-zoom
 * - Reset view: Sun center + default camera distance
 */
export function CameraRig() {
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const { camera, gl } = useThree()
  const focusMode = useSimulation((s) => s.focusMode)
  const cameraResetToken = useSimulation((s) => s.cameraResetToken)
  const prevToken = useRef(cameraResetToken)
  const panning = useRef(false)

  // Right/middle mouse pan unlocks free center so zoom can re-center elsewhere
  useEffect(() => {
    const el = gl.domElement
    const onPointerDown = (e: PointerEvent) => {
      // 1 = middle, 2 = right (default OrbitControls pan)
      if (e.button !== 1 && e.button !== 2) return
      panning.current = true
      const controls = controlsRef.current
      if (!controls) return
      const t = controls.target
      if (simulationStore.getState().focusMode !== 'free') {
        simulationStore.setFreeFocus([t.x, t.y, t.z])
      }
    }
    const onPointerUp = () => {
      if (!panning.current) return
      panning.current = false
      const controls = controlsRef.current
      if (!controls) return
      const t = controls.target
      simulationStore.setFreeTarget([t.x, t.y, t.z])
    }
    el.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', onPointerUp)
    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [gl])

  // Reset camera pose when requested
  useEffect(() => {
    if (cameraResetToken === prevToken.current) return
    prevToken.current = cameraResetToken
    const controls = controlsRef.current
    if (!controls) return

    const st = simulationStore.getState()
    const [tx, ty, tz] = resolveTarget(
      st.focusMode,
      st.focusBodyId,
      st.freeTarget,
      st.simDays,
    )
    controls.target.set(tx, ty, tz)
    camera.position.set(tx + DEFAULT_OFFSET.x, ty + DEFAULT_OFFSET.y, tz + DEFAULT_OFFSET.z)
    controls.update()
  }, [cameraResetToken, camera])

  // Snap target when focus mode changes via UI (not free pan)
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls || focusMode === 'free') return
    const st = simulationStore.getState()
    const [tx, ty, tz] = resolveTarget(
      st.focusMode,
      st.focusBodyId,
      st.freeTarget,
      st.simDays,
    )
    _offset.copy(camera.position).sub(controls.target)
    controls.target.set(tx, ty, tz)
    camera.position.copy(controls.target).add(_offset)
    controls.update()
  }, [focusMode, camera])

  useFrame(() => {
    const controls = controlsRef.current
    if (!controls) return

    const st = simulationStore.getState()
    if (st.focusMode === 'free' || panning.current) return

    const [tx, ty, tz] = resolveTarget(
      st.focusMode,
      st.focusBodyId,
      st.freeTarget,
      st.simDays,
    )
    _target.set(tx, ty, tz)
    _offset.copy(camera.position).sub(controls.target)
    controls.target.copy(_target)
    camera.position.copy(_target).add(_offset)
    controls.update()
  })

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.07}
      minDistance={0.8}
      maxDistance={800}
      zoomSpeed={1.15}
      rotateSpeed={0.88}
      panSpeed={0.85}
      target={[0, 0, 0]}
    />
  )
}
