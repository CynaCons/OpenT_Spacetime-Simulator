import { useSyncExternalStore } from 'react'
import { SANDBOX_G0 } from '../physics/newton'

export interface SandboxBody {
  id: string
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  mass: number
  color: string
  /** Fixed central mass (does not integrate) */
  fixed?: boolean
  trail: Array<[number, number, number]>
}

export interface NewtonState {
  showVelocity: boolean
  showForce: boolean
  showPeriods: boolean
  tourBodyId: string | null
  /** Sandbox */
  sandboxBodies: SandboxBody[]
  sandboxG: number
  sandboxPaused: boolean
  sandboxTrails: boolean
  selectedSandboxId: string | null
  placeMode: 'mass' | 'particle' | null
}

type Listener = () => void
const listeners = new Set<Listener>()

let idCounter = 1
function nextId(prefix: string) {
  idCounter += 1
  return `${prefix}-${idCounter}`
}

function defaultSandbox(): SandboxBody[] {
  return [
    {
      id: 'central',
      x: 0,
      y: 0,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      mass: 40,
      color: '#ffcc66',
      fixed: true,
      trail: [],
    },
    {
      id: 'orbiter',
      x: 6,
      y: 0,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 3.2,
      mass: 1,
      color: '#5b9dff',
      trail: [],
    },
  ]
}

let state: NewtonState = {
  showVelocity: true,
  showForce: false,
  showPeriods: true,
  tourBodyId: 'earth',
  sandboxBodies: defaultSandbox(),
  sandboxG: SANDBOX_G0,
  sandboxPaused: false,
  sandboxTrails: true,
  selectedSandboxId: 'orbiter',
  placeMode: null,
}

function emit() {
  for (const l of listeners) l()
}

function setState(partial: Partial<NewtonState>) {
  state = { ...state, ...partial }
  emit()
}

const MAX_TRAIL = 180

export const newtonStore = {
  getState: () => state,
  subscribe: (listener: Listener) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  toggleVelocity: () => setState({ showVelocity: !state.showVelocity }),
  toggleForce: () => setState({ showForce: !state.showForce }),
  togglePeriods: () => setState({ showPeriods: !state.showPeriods }),
  setTourBody: (tourBodyId: string | null) => setState({ tourBodyId }),
  setSandboxG: (sandboxG: number) => setState({ sandboxG: Math.max(0.1, sandboxG) }),
  toggleSandboxPause: () => setState({ sandboxPaused: !state.sandboxPaused }),
  setSandboxPaused: (sandboxPaused: boolean) => setState({ sandboxPaused }),
  toggleTrails: () => setState({ sandboxTrails: !state.sandboxTrails }),
  selectSandbox: (selectedSandboxId: string | null) => setState({ selectedSandboxId }),
  setPlaceMode: (placeMode: 'mass' | 'particle' | null) => setState({ placeMode }),
  resetSandbox: () =>
    setState({
      sandboxBodies: defaultSandbox(),
      selectedSandboxId: 'orbiter',
      sandboxPaused: false,
      placeMode: null,
    }),
  addBodyAt: (x: number, y: number, z: number, kind: 'mass' | 'particle') => {
    const body: SandboxBody = {
      id: nextId(kind),
      x,
      y,
      z,
      vx: kind === 'particle' ? 0 : 0,
      vy: 0,
      vz: kind === 'particle' ? 2.8 : 0,
      mass: kind === 'mass' ? 12 : 0.8,
      color: kind === 'mass' ? '#e27b58' : '#7ddea8',
      fixed: kind === 'mass' && state.sandboxBodies.filter((b) => b.fixed).length === 0,
      trail: [],
    }
    // particles get tangential hint if central exists
    const central = state.sandboxBodies.find((b) => b.fixed) ?? state.sandboxBodies[0]
    if (kind === 'particle' && central) {
      const dx = x - central.x
      const dz = z - central.z
      const r = Math.hypot(dx, dz) || 1
      const speed = Math.sqrt((state.sandboxG * central.mass) / r) * 0.95
      body.vx = (-dz / r) * speed
      body.vz = (dx / r) * speed
    }
    setState({
      sandboxBodies: [...state.sandboxBodies, body],
      selectedSandboxId: body.id,
      placeMode: null,
    })
  },
  removeSelected: () => {
    if (!state.selectedSandboxId) return
    const id = state.selectedSandboxId
    if (id === 'central') return
    setState({
      sandboxBodies: state.sandboxBodies.filter((b) => b.id !== id),
      selectedSandboxId: null,
    })
  },
  setSelectedVelocity: (vx: number, vz: number) => {
    const id = state.selectedSandboxId
    if (!id) return
    setState({
      sandboxBodies: state.sandboxBodies.map((b) =>
        b.id === id && !b.fixed ? { ...b, vx, vz, vy: 0 } : b,
      ),
    })
  },
  setSelectedMass: (mass: number) => {
    const id = state.selectedSandboxId
    if (!id) return
    setState({
      sandboxBodies: state.sandboxBodies.map((b) =>
        b.id === id ? { ...b, mass: Math.max(0.1, mass) } : b,
      ),
    })
  },
  /** Integrate sandbox one step (semi-implicit Euler / kick-drift). */
  tickSandbox: (dt: number) => {
    if (state.sandboxPaused || dt <= 0) return
    const G = state.sandboxG
    const bodies = state.sandboxBodies
    const next = bodies.map((b) => ({ ...b, trail: [...b.trail] }))

    for (let i = 0; i < next.length; i++) {
      const bi = next[i]
      if (bi.fixed) continue
      let ax = 0
      let ay = 0
      let az = 0
      for (let j = 0; j < next.length; j++) {
        if (i === j) continue
        const bj = next[j]
        const dx = bj.x - bi.x
        const dy = bj.y - bi.y
        const dz = bj.z - bi.z
        const r2 = dx * dx + dy * dy + dz * dz + 0.15
        const r = Math.sqrt(r2)
        const f = (G * bj.mass) / r2
        ax += (f * dx) / r
        ay += (f * dy) / r
        az += (f * dz) / r
      }
      bi.vx += ax * dt
      bi.vy += ay * dt
      bi.vz += az * dt
      bi.x += bi.vx * dt
      bi.y += bi.vy * dt
      bi.z += bi.vz * dt
      if (state.sandboxTrails) {
        bi.trail.push([bi.x, bi.y, bi.z])
        if (bi.trail.length > MAX_TRAIL) bi.trail.splice(0, bi.trail.length - MAX_TRAIL)
      }
    }
    setState({ sandboxBodies: next })
  },
}

export function useNewton<T>(selector: (s: NewtonState) => T): T {
  return useSyncExternalStore(
    newtonStore.subscribe,
    () => selector(newtonStore.getState()),
    () => selector(newtonStore.getState()),
  )
}
