import { useSyncExternalStore } from 'react'
import { CHAPTERS } from '../content/chapters'

export type TimeSpeed = 0 | 1 | 10 | 50 | 200

/**
 * Camera orbit center mode:
 * - sun: always orbit the Sun at origin
 * - earth: follow Earth (moving target)
 * - body: follow a selected body id
 * - free: user-controlled center (pan / double-click empty space keeps free)
 */
export type FocusMode = 'sun' | 'earth' | 'body' | 'free'

interface SimulationState {
  chapterId: string
  /** Simulated days since epoch (scaffold) */
  simDays: number
  speed: TimeSpeed
  paused: boolean
  selectedBodyId: string | null
  showOrbits: boolean
  showLabels: boolean
  /** What the camera orbits around */
  focusMode: FocusMode
  /** When focusMode === 'body', which body to follow */
  focusBodyId: string | null
  /**
   * Free-mode orbit target in scene units.
   * When switching to free from a body, we seed this from that body's position.
   */
  freeTarget: [number, number, number]
  /** Incremented to request camera pose reset (distance + angles) */
  cameraResetToken: number
  /** Chapter side panel visible */
  panelOpen: boolean
  /** Lab console (bottom-left HUD) expanded */
  hudOpen: boolean
}

type Listener = () => void

const listeners = new Set<Listener>()

const DEFAULT_FREE_TARGET: [number, number, number] = [0, 0, 0]

let state: SimulationState = {
  chapterId: CHAPTERS[0]?.id ?? 'earth-not-flat',
  simDays: 0,
  speed: 10,
  paused: false,
  selectedBodyId: null,
  showOrbits: true,
  showLabels: true,
  focusMode: 'sun',
  focusBodyId: null,
  freeTarget: DEFAULT_FREE_TARGET,
  cameraResetToken: 0,
  panelOpen: true,
  hudOpen: true,
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
  setPanelOpen: (panelOpen: boolean) => setState({ panelOpen }),
  togglePanel: () => setState({ panelOpen: !state.panelOpen }),
  toggleHud: () => setState({ hudOpen: !state.hudOpen }),

  focusSun: (resetPose = false) =>
    setState({
      focusMode: 'sun',
      focusBodyId: null,
      freeTarget: [0, 0, 0],
      cameraResetToken: resetPose ? state.cameraResetToken + 1 : state.cameraResetToken,
    }),

  focusEarth: (resetPose = false) =>
    setState({
      focusMode: 'earth',
      focusBodyId: 'earth',
      selectedBodyId: 'earth',
      cameraResetToken: resetPose ? state.cameraResetToken + 1 : state.cameraResetToken,
    }),

  focusBody: (bodyId: string, resetPose = false) =>
    setState({
      focusMode: bodyId === 'sun' ? 'sun' : bodyId === 'earth' ? 'earth' : 'body',
      focusBodyId: bodyId === 'sun' ? null : bodyId,
      selectedBodyId: bodyId === 'sun' ? state.selectedBodyId : bodyId,
      cameraResetToken: resetPose ? state.cameraResetToken + 1 : state.cameraResetToken,
    }),

  /** Unlock follow; keep current orbit center so user can re-zoom elsewhere. */
  setFreeFocus: (target?: [number, number, number]) =>
    setState({
      focusMode: 'free',
      focusBodyId: null,
      freeTarget: target ?? state.freeTarget,
    }),

  setFreeTarget: (freeTarget: [number, number, number]) =>
    setState({ focusMode: 'free', freeTarget, focusBodyId: null }),

  /** Reset orbit center to Sun and restore default camera distance/angle. */
  resetCamera: () =>
    setState({
      focusMode: 'sun',
      focusBodyId: null,
      freeTarget: [0, 0, 0],
      cameraResetToken: state.cameraResetToken + 1,
    }),

  resetChapter: () =>
    setState({
      simDays: 0,
      selectedBodyId: null,
      speed: 10,
      paused: false,
      showOrbits: true,
      showLabels: true,
      focusMode: 'sun',
      focusBodyId: null,
      freeTarget: [0, 0, 0],
      cameraResetToken: state.cameraResetToken + 1,
    }),
}

export function useSimulation<T>(selector: (s: SimulationState) => T): T {
  return useSyncExternalStore(
    simulationStore.subscribe,
    () => selector(simulationStore.getState()),
    () => selector(simulationStore.getState()),
  )
}
