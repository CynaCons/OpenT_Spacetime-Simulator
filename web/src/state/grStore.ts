import { useSyncExternalStore } from 'react'

export type GrPicture = 'geodesic' | 'force' | 'both'
export type ProbePhase = 'ready' | 'falling' | 'landed'

export interface GrState {
  /** Central mass in solar masses (teaching) */
  massSolar: number
  picture: GrPicture
  showPhoton: boolean
  showGrid: boolean
  /** Which planet geodesic to highlight */
  focusBody: 'mercury' | 'earth' | 'jupiter'
  animT: number
  paused: boolean
  speed: number
  /** Free-fall probe: released at rest, it rolls down the curvature well */
  probePhase: ProbePhase
  /** Release radius (scene units) */
  probeR0: number
  /** Current radius */
  probeR: number
  /** Radial velocity (negative = inward) */
  probeV: number
  /** Radius history for the trail (positions are draped on the fabric at render) */
  probeTrailR: number[]
}

type Listener = () => void
const listeners = new Set<Listener>()

/** Toy gravitational parameter: fall from r=7 at M=1 takes a few seconds. */
const PROBE_K = 8.5
const TRAIL_CAP = 360

let state: GrState = {
  massSolar: 1,
  picture: 'both',
  showPhoton: true,
  showGrid: true,
  focusBody: 'earth',
  animT: 0,
  paused: false,
  speed: 1,
  probePhase: 'ready',
  probeR0: 7,
  probeR: 7,
  probeV: 0,
  probeTrailR: [],
}

function emit() {
  for (const l of listeners) l()
}
function setState(partial: Partial<GrState>) {
  state = { ...state, ...partial }
  emit()
}

/** Radius of the central mass sphere (matches CentralMass mesh). */
export function centralMassRadius(massSolar: number): number {
  return 0.55 + massSolar * 0.25
}

export const grStore = {
  getState: () => state,
  subscribe: (l: Listener) => {
    listeners.add(l)
    return () => listeners.delete(l)
  },
  setMass: (massSolar: number) => setState({ massSolar: Math.max(0.2, Math.min(5, massSolar)) }),
  setPicture: (picture: GrPicture) => setState({ picture }),
  togglePhoton: () => setState({ showPhoton: !state.showPhoton }),
  toggleGrid: () => setState({ showGrid: !state.showGrid }),
  setFocusBody: (focusBody: GrState['focusBody']) => setState({ focusBody }),
  togglePause: () => setState({ paused: !state.paused }),
  setSpeed: (speed: number) => setState({ speed }),
  releaseProbe: () =>
    setState({
      probePhase: 'falling',
      probeR: state.probeR0,
      probeV: 0,
      probeTrailR: [state.probeR0],
    }),
  resetProbe: () =>
    setState({ probePhase: 'ready', probeR: state.probeR0, probeV: 0, probeTrailR: [] }),
  setProbeR0: (r: number) => {
    const probeR0 = Math.max(3, Math.min(10, r))
    setState(
      state.probePhase === 'falling'
        ? { probeR0 }
        : { probeR0, probeR: probeR0, probeV: 0, probePhase: 'ready', probeTrailR: [] },
    )
  },
  reset: () =>
    setState({
      animT: 0,
      massSolar: 1,
      paused: false,
      probePhase: 'ready',
      probeR: state.probeR0,
      probeV: 0,
      probeTrailR: [],
    }),
  tick: (dt: number) => {
    if (state.paused) return
    const step = Math.min(dt, 0.05) * state.speed
    const partial: Partial<GrState> = { animT: state.animT + step }

    if (state.probePhase === 'falling') {
      // Semi-implicit Euler on radial free fall: a = -K M / r²
      let v = state.probeV - ((PROBE_K * state.massSolar) / (state.probeR * state.probeR)) * step
      let r = state.probeR + v * step
      let phase: ProbePhase = 'falling'
      const floor = centralMassRadius(state.massSolar) + 0.12
      if (r <= floor) {
        r = floor
        v = 0
        phase = 'landed'
      }
      const trail = [...state.probeTrailR, r]
      if (trail.length > TRAIL_CAP) trail.splice(0, trail.length - TRAIL_CAP)
      partial.probeR = r
      partial.probeV = v
      partial.probePhase = phase
      partial.probeTrailR = trail
    }

    setState(partial)
  },
}

export function useGr<T>(selector: (s: GrState) => T): T {
  return useSyncExternalStore(
    grStore.subscribe,
    () => selector(grStore.getState()),
    () => selector(grStore.getState()),
  )
}
