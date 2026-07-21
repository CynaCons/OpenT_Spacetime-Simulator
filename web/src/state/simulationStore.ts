import { useSyncExternalStore } from 'react'
import { CHAPTERS } from '../content/chapters'

export type TimeSpeed = 0 | 1 | 10 | 50 | 200

interface SimulationState {
  chapterId: string
  /** Simulated days since epoch (scaffold) */
  simDays: number
  speed: TimeSpeed
  paused: boolean
  selectedBodyId: string | null
  showOrbits: boolean
  showLabels: boolean
}

type Listener = () => void

const listeners = new Set<Listener>()

let state: SimulationState = {
  chapterId: CHAPTERS[0]?.id ?? 'earth-not-flat',
  simDays: 0,
  speed: 10,
  paused: false,
  selectedBodyId: null,
  showOrbits: true,
  showLabels: true,
}

function emit() {
  for (const l of listeners) l()
}

function setState(partial: Partial<SimulationState>) {
  state = { ...state, ...partial }
  emit()
}

export const simulationStore = {
  getState: () => state,
  subscribe: (listener: Listener) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  setChapter: (chapterId: string) => setState({ chapterId }),
  setSpeed: (speed: TimeSpeed) => setState({ speed, paused: speed === 0 }),
  togglePause: () =>
    setState({
      paused: !state.paused,
      speed: state.paused ? (state.speed === 0 ? 10 : state.speed) : state.speed,
    }),
  setPaused: (paused: boolean) => setState({ paused }),
  advanceTime: (deltaSimDays: number) => {
    if (state.paused || state.speed === 0) return
    setState({ simDays: state.simDays + deltaSimDays })
  },
  resetTime: () => setState({ simDays: 0 }),
  selectBody: (selectedBodyId: string | null) => setState({ selectedBodyId }),
  toggleOrbits: () => setState({ showOrbits: !state.showOrbits }),
  toggleLabels: () => setState({ showLabels: !state.showLabels }),
  resetChapter: () =>
    setState({
      simDays: 0,
      selectedBodyId: null,
      speed: 10,
      paused: false,
      showOrbits: true,
      showLabels: true,
    }),
}

export function useSimulation<T>(selector: (s: SimulationState) => T): T {
  return useSyncExternalStore(
    simulationStore.subscribe,
    () => selector(simulationStore.getState()),
    () => selector(simulationStore.getState()),
  )
}
