import { useSyncExternalStore } from 'react'

export type ProofSubDemo = 'eclipse' | 'gps'
export type DeflectionModel = 'none' | 'newton' | 'gr'

export interface ProofsState {
  subDemo: ProofSubDemo
  deflectionModel: DeflectionModel
  /** Eclipse animation 0–1 */
  eclipsePhase: number
  playing: boolean
  /** GPS: accumulated days of uncorrected error */
  gpsDays: number
  gpsApplySR: boolean
  gpsApplyGR: boolean
  gpsPlaying: boolean
}

type Listener = () => void
const listeners = new Set<Listener>()

let state: ProofsState = {
  subDemo: 'eclipse',
  deflectionModel: 'gr',
  eclipsePhase: 0.65,
  playing: true,
  gpsDays: 0,
  gpsApplySR: false,
  gpsApplyGR: false,
  gpsPlaying: true,
}

function emit() {
  for (const l of listeners) l()
}
function setState(partial: Partial<ProofsState>) {
  state = { ...state, ...partial }
  emit()
}

export const proofsStore = {
  getState: () => state,
  subscribe: (l: Listener) => {
    listeners.add(l)
    return () => listeners.delete(l)
  },
  setSubDemo: (subDemo: ProofSubDemo) => setState({ subDemo }),
  setDeflectionModel: (deflectionModel: DeflectionModel) => setState({ deflectionModel }),
  setEclipsePhase: (eclipsePhase: number) =>
    setState({ eclipsePhase: Math.min(1, Math.max(0, eclipsePhase)) }),
  togglePlay: () => setState({ playing: !state.playing }),
  setGpsApplySR: (gpsApplySR: boolean) => setState({ gpsApplySR }),
  setGpsApplyGR: (gpsApplyGR: boolean) => setState({ gpsApplyGR }),
  toggleGpsPlay: () => setState({ gpsPlaying: !state.gpsPlaying }),
  resetGps: () => setState({ gpsDays: 0 }),
  resetEclipse: () => setState({ eclipsePhase: 0, playing: true }),
  tick: (dt: number) => {
    if (state.subDemo === 'eclipse' && state.playing) {
      setState({ eclipsePhase: (state.eclipsePhase + dt * 0.08) % 1 })
    }
    if (state.subDemo === 'gps' && state.gpsPlaying) {
      setState({ gpsDays: state.gpsDays + dt * 0.35 })
    }
  },
}

export function useProofs<T>(selector: (s: ProofsState) => T): T {
  return useSyncExternalStore(
    proofsStore.subscribe,
    () => selector(proofsStore.getState()),
    () => selector(proofsStore.getState()),
  )
}
