import { useSyncExternalStore } from 'react'

export type SrSubDemo = 'lightclock' | 'length'

export interface SrState {
  subDemo: SrSubDemo
  /** v/c in lab frame for moving clock / rod */
  beta: number
  paused: boolean
  /** lab time (seconds of animation) */
  labTime: number
  showGamma: boolean
}

type Listener = () => void
const listeners = new Set<Listener>()

let state: SrState = {
  subDemo: 'lightclock',
  beta: 0.6,
  paused: false,
  labTime: 0,
  showGamma: true,
}

function emit() {
  for (const l of listeners) l()
}
function setState(partial: Partial<SrState>) {
  state = { ...state, ...partial }
  emit()
}

export const srStore = {
  getState: () => state,
  subscribe: (l: Listener) => {
    listeners.add(l)
    return () => listeners.delete(l)
  },
  setSubDemo: (subDemo: SrSubDemo) => setState({ subDemo }),
  setBeta: (beta: number) => setState({ beta: Math.min(0.99, Math.max(0, beta)) }),
  togglePause: () => setState({ paused: !state.paused }),
  setPaused: (paused: boolean) => setState({ paused }),
  toggleGamma: () => setState({ showGamma: !state.showGamma }),
  reset: () => setState({ labTime: 0, beta: 0.6, paused: false }),
  tick: (dt: number) => {
    if (state.paused) return
    setState({ labTime: state.labTime + dt })
  },
}

export function useSr<T>(selector: (s: SrState) => T): T {
  return useSyncExternalStore(
    srStore.subscribe,
    () => selector(srStore.getState()),
    () => selector(srStore.getState()),
  )
}
