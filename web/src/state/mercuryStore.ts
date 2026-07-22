import { useSyncExternalStore } from 'react'
import { teachingPrecessionRadPerDay } from '../physics/mercury'

/**
 * Display model for the Mercury lab:
 * - newton: closed Kepler ellipse (fixed periapsis) — what pure inverse-square predicts for one body
 * - residual: precessing ellipse at residual GR rate (exaggerated for visibility)
 * - compare: both orbits overlaid
 */
export type MercuryModel = 'newton' | 'residual' | 'compare'

export interface MercuryState {
  model: MercuryModel
  /** Multiplier on true residual rate for teaching visibility */
  exaggeration: number
  /** Simulation days (lab-local clock) */
  simDays: number
  speed: number
  paused: boolean
  showRosette: boolean
  showPeriapsis: boolean
  showHistory: boolean
  /** Accumulated trail of residual orbit for rosette */
  trail: Array<[number, number, number]>
}

type Listener = () => void
const listeners = new Set<Listener>()

const MAX_TRAIL = 2400

let state: MercuryState = {
  model: 'compare',
  exaggeration: 2_500_000, // makes ~43″/century visible as several ° over a short demo
  simDays: 0,
  speed: 40,
  paused: false,
  showRosette: true,
  showPeriapsis: true,
  showHistory: true,
  trail: [],
}

function emit() {
  for (const l of listeners) l()
}

function setState(partial: Partial<MercuryState>) {
  state = { ...state, ...partial }
  emit()
}

export const mercuryStore = {
  getState: () => state,
  subscribe: (listener: Listener) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  setModel: (model: MercuryModel) => setState({ model }),
  setExaggeration: (exaggeration: number) =>
    setState({ exaggeration: Math.max(1, Math.min(20_000_000, exaggeration)) }),
  setSpeed: (speed: number) => setState({ speed, paused: speed === 0 }),
  togglePause: () => setState({ paused: !state.paused }),
  setPaused: (paused: boolean) => setState({ paused }),
  toggleRosette: () => setState({ showRosette: !state.showRosette }),
  togglePeriapsis: () => setState({ showPeriapsis: !state.showPeriapsis }),
  toggleHistory: () => setState({ showHistory: !state.showHistory }),
  reset: () =>
    setState({
      simDays: 0,
      trail: [],
      paused: false,
      speed: 40,
    }),
  tick: (dtSec: number) => {
    if (state.paused || state.speed === 0) return
    setState({ simDays: state.simDays + dtSec * state.speed })
  },
  pushTrailPoint: (p: [number, number, number]) => {
    if (!state.showRosette) return
    const trail = [...state.trail, p]
    if (trail.length > MAX_TRAIL) trail.splice(0, trail.length - MAX_TRAIL)
    setState({ trail })
  },
  clearTrail: () => setState({ trail: [] }),
  /** Current residual omega (radians) at simDays with teaching exaggeration. */
  residualOmega: () => teachingPrecessionRadPerDay(state.exaggeration) * state.simDays,
}

export function useMercury<T>(selector: (s: MercuryState) => T): T {
  return useSyncExternalStore(
    mercuryStore.subscribe,
    () => selector(mercuryStore.getState()),
    () => selector(mercuryStore.getState()),
  )
}

/** Suggested exaggeration presets for the UI. */
export const EXAGGERATION_PRESETS = [
  { label: 'Subtle', value: 400_000 },
  { label: 'Clear (default)', value: 2_500_000 },
  { label: 'Dramatic', value: 8_000_000 },
] as const
