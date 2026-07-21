import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import type { Camera } from 'three'
import { Vector3 } from 'three'
import { altitudeKmToSceneHeight, EARTH_RADIUS_SCENE } from '../../physics/earthGeometry'
import { earthLabStore, useEarthLab } from '../../state/earthLabStore'
import { getRocketWorldPosition } from './rocketPosition'

const _target = new Vector3()
const _offset = new Vector3()
const _look = new Vector3()
const _camPos = new Vector3()

function applyHorizonPose(
  cam: Camera,
  controls: OrbitControlsImpl,
  alt: number,
  exaggerated: boolean,
  model: 'sphere' | 'flat',
) {
  const rocket = getRocketWorldPosition(alt, exaggerated, model, _target)
  const h = altitudeKmToSceneHeight(alt, exaggerated)

  if (model === 'sphere') {
    const R = EARTH_RADIUS_SCENE
    const rObs = R + h
    const sceneDip = Math.acos(Math.min(1, R / Math.max(rObs, R + 1e-6)))
    const ringY = rObs * Math.cos(sceneDip)
    const ringR = Math.max(0.4, rObs * Math.sin(sceneDip))
    _look.set(ringR, ringY, 0)
    _camPos.set(rocket.x + 0.08, rocket.y + 0.14, rocket.z + 0.7)
  } else {
    _look.set(10, h, 0)
    _camPos.set(0.1, h + 0.2, 0.85)
  }

  cam.position.copy(_camPos)
  controls.target.copy(rocket)
  cam.lookAt(_look)
  controls.target.lerp(_look, 0.35)
  controls.update()
}

function applyNadirPose(
  cam: Camera,
  controls: OrbitControlsImpl,
  alt: number,
  exaggerated: boolean,
  model: 'sphere' | 'flat',
) {
  const rocket = getRocketWorldPosition(alt, exaggerated, model, _target)
  _camPos.copy(rocket).add(new Vector3(0.55, 0.45, 0.35))
  cam.position.copy(_camPos)
  controls.target.set(0, 0, 0)
  cam.lookAt(controls.target)
  controls.update()
}

function applyShipDefaultPose(
  cam: Camera,
  controls: OrbitControlsImpl,
  model: 'sphere' | 'flat',
) {
  if (model === 'sphere') {
    // Side profile of the globe so curvature + hull drop read clearly
    cam.position.set(3.2, 4.6, 7.2)
    controls.target.set(1.6, 3.6, 0)
  } else {
    cam.position.set(2.5, 2.2, 6.5)
    controls.target.set(3.5, 0.2, 0)
  }
  cam.lookAt(controls.target)
  controls.update()
}

/**
 * Always-on orbit camera for the Earth lab.
 * Drag / scroll always work. Horizon / Down are snap presets;
 * dragging frees the camera. Orbit target follows the rocket while climbing.
 */
export function EarthLabCamera() {
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const { camera } = useThree()
  const subDemo = useEarthLab((s) => s.subDemo)
  const lookMode = useEarthLab((s) => s.lookMode)
  const snapToken = useEarthLab((s) => s.cameraSnapToken)
  const shapeModel = useEarthLab((s) => s.shapeModel)

  const followLocked = useRef(true)
  const lastSnap = useRef(-1)
  const lastSubDemo = useRef(subDemo)

  useEffect(() => {
    followLocked.current = lookMode !== 'orbit'
    lastSnap.current = -1
  }, [snapToken, lookMode])

  useEffect(() => {
    if (lastSubDemo.current !== subDemo) {
      lastSubDemo.current = subDemo
      followLocked.current = true
      lastSnap.current = -1
      earthLabStore.requestCameraSnap()
    }
  }, [subDemo])

  useEffect(() => {
    if (lookMode === 'horizon' || lookMode === 'nadir') {
      earthLabStore.requestCameraSnap()
    }
  }, [shapeModel, lookMode])

  useFrame(() => {
    const controls = controlsRef.current
    if (!controls) return

    const st = earthLabStore.getState()
    const { altitudeKm, exaggerated, shapeModel: model, lookMode: mode, subDemo: demo } = st

    if (demo === 'ship') {
      if (lastSnap.current !== st.cameraSnapToken) {
        lastSnap.current = st.cameraSnapToken
        applyShipDefaultPose(camera, controls, model)
        followLocked.current = false
      }
      return
    }

    const rocket = getRocketWorldPosition(altitudeKm, exaggerated, model, _target)

    if (lastSnap.current !== st.cameraSnapToken) {
      lastSnap.current = st.cameraSnapToken
      if (mode === 'nadir') {
        applyNadirPose(camera, controls, altitudeKm, exaggerated, model)
        followLocked.current = true
      } else if (mode === 'horizon') {
        applyHorizonPose(camera, controls, altitudeKm, exaggerated, model)
        followLocked.current = true
      } else {
        _offset.copy(camera.position).sub(controls.target)
        if (_offset.lengthSq() < 0.01) {
          _offset.set(0.4, 0.5, 1.2)
        }
        controls.target.copy(rocket)
        camera.position.copy(rocket).add(_offset)
        controls.update()
        followLocked.current = false
      }
      return
    }

    if (followLocked.current && (mode === 'horizon' || mode === 'nadir')) {
      if (mode === 'horizon') {
        applyHorizonPose(camera, controls, altitudeKm, exaggerated, model)
      } else {
        applyNadirPose(camera, controls, altitudeKm, exaggerated, model)
      }
      return
    }

    // Free orbit: keep target on rocket so zoom stays useful as it climbs
    _offset.copy(camera.position).sub(controls.target)
    controls.target.copy(rocket)
    camera.position.copy(rocket).add(_offset)
    controls.update()
  })

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minDistance={0.25}
      maxDistance={60}
      maxPolarAngle={Math.PI}
      onStart={() => {
        followLocked.current = false
        if (earthLabStore.getState().lookMode !== 'orbit') {
          earthLabStore.setLookMode('orbit', false)
        }
      }}
    />
  )
}
