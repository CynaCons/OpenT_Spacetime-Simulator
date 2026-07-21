import { useSyncExternalStore } from 'react'

export type EarthSubDemo = 'rocket' | 'ship'
export type EarthShapeModel = 'sphere' | 'flat'
/** horizon/nadir = snap + soft follow until user drags; orbit = free OrbitControls */
export type RocketLookMode = 'horizon' | 'nadir' | 'orbit'

export interface EarthLabState {
  subDemo: EarthSubDemo
  shapeModel: EarthShapeModel
  /** Rocket altitude above surface (km), pedagogical */
  altitudeKm: number
  /** Animate rocket upward */
  launching: boolean
  /** Exaggerate scene height so curvature is obvious */
  exaggerated: boolean
  lookMode: RocketLookMode
  showGrid: boolean
  showHorizonGuide: boolean
  /** Ship demo: surface distance from observer (km) */
  shipDistanceKm: number
  shipPlaying: boolean
  /** Bump to force a camera snap to the current look preset */
  cameraSnapToken: number
}

type Listener = () => void
const listeners = new Set<Listener>()

const MAX_ALT_KM = 2000
const MAX_SHIP_KM = 800

let state: EarthLabState = {
  subDemo: 'rocket',
  shapeModel: 'sphere',
  altitudeKm: 0,
  launching: false,
  exaggerated: true,
  lookMode: 'horizon',
  showGrid: true,
  showHorizonGuide: true,
  shipDistanceKm: 5,
  shipPlaying: false,
  cameraSnapToken: 1,
}

function emit() {
  for (const l of listeners) l()
}

function setState(partial: Partial<EarthLabState>) {
  state = { ...state, ...partial }
  emit()
}

export const earthLabStore = {
  getState: () => state,
  subscribe: (listener: Listener) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  setSubDemo: (subDemo: EarthSubDemo) =>
    setState({
      subDemo,
      launching: false,
      shipPlaying: false,
      cameraSnapToken: state.cameraSnapToken + 1,
      lookMode: subDemo === 'ship' ? 'orbit' : state.lookMode,
    }),
  setShapeModel: (shapeModel: EarthShapeModel) => setState({ shapeModel }),
  setAltitudeKm: (altitudeKm: number) =>
    setState({ altitudeKm: Math.min(MAX_ALT_KM, Math.max(0, altitudeKm)) }),
  setLaunching: (launching: boolean) => setState({ launching }),
  toggleLaunch: () => setState({ launching: !state.launching }),
  setExaggerated: (exaggerated: boolean) => setState({ exaggerated }),
  /**
   * @param snap when true (default), re-apply the camera preset.
   *             false = only update mode UI (e.g. user started dragging).
   */
  setLookMode: (lookMode: RocketLookMode, snap = true) =>
    setState({
      lookMode,
      cameraSnapToken: snap ? state.cameraSnapToken + 1 : state.cameraSnapToken,
    }),
  requestCameraSnap: () => setState({ cameraSnapToken: state.cameraSnapToken + 1 }),
  toggleGrid: () => setState({ showGrid: !state.showGrid }),
  toggleHorizonGuide: () => setState({ showHorizonGuide: !state.showHorizonGuide }),
  setShipDistanceKm: (shipDistanceKm: number) =>
    setState({ shipDistanceKm: Math.min(MAX_SHIP_KM, Math.max(0, shipDistanceKm)) }),
  setShipPlaying: (shipPlaying: boolean) => setState({ shipPlaying }),
  toggleShipPlay: () => setState({ shipPlaying: !state.shipPlaying }),
  resetDemo: () =>
    setState({
      altitudeKm: 0,
      launching: false,
      shipDistanceKm: 5,
      shipPlaying: false,
      lookMode: 'horizon',
      cameraSnapToken: state.cameraSnapToken + 1,
    }),
  /** Advance rocket altitude during launch (km per real second target). */
  tickLaunch: (dtSec: number) => {
    if (!state.launching) return
    const rate = state.altitudeKm < 400 ? 35 : 80
    const next = Math.min(MAX_ALT_KM, state.altitudeKm + rate * dtSec)
    if (next >= MAX_ALT_KM) {
      setState({ altitudeKm: MAX_ALT_KM, launching: false })
    } else {
      setState({ altitudeKm: next })
    }
  },
  tickShip: (dtSec: number) => {
    if (!state.shipPlaying) return
    const next = Math.min(MAX_SHIP_KM, state.shipDistanceKm + 40 * dtSec)
    if (next >= MAX_SHIP_KM) {
      setState({ shipDistanceKm: MAX_SHIP_KM, shipPlaying: false })
    } else {
      setState({ shipDistanceKm: next })
    }
  },
}

export const EARTH_LAB_LIMITS = {
  maxAltitudeKm: MAX_ALT_KM,
  maxShipKm: MAX_SHIP_KM,
}

export function useEarthLab<T>(selector: (s: EarthLabState) => T): T {
  return useSyncExternalStore(
    earthLabStore.subscribe,
    () => selector(earthLabStore.getState()),
    () => selector(earthLabStore.getState()),
  )
}
