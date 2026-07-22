import { useSyncExternalStore } from 'react'

export type GrPicture = 'geodesic' | 'force' | 'both'

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
}

type Listener = () => void
const listeners = new Set<Listener>()

let state: GrState = {
  massSolar: 1,
  picture: 'both',
  showPhoton: true,
  showGrid: true,
  focusBody: 'earth',
  animT: 0,
  paused: false,
  speed: 1,
}

function emit() {
  for (const l of listeners) l()
}
function setState(partial: Partial<GrState>) {
  state = { ...state, ...partial }
  emit()
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
  reset: () => setState({ animT: 0, massSolar: 1, paused: false }),
  tick: (dt: number) => {
    if (state.paused) return
    setState({ animT: state.animT + dt * state.speed })
  },
}

export function useGr<T>(selector: (s: GrState) => T): T {
  return useSyncExternalStore(
    grStore.subscribe,
    () => selector(grStore.getState()),
    () => selector(grStore.getState()),
  )
}
