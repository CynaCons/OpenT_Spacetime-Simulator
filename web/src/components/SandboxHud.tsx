import { sandboxEscapeInfo } from '../scenes/GravitySandboxScene'
import { newtonStore, useNewton } from '../state/newtonStore'
import { HudShell } from './HudShell'
import styles from './EarthLabHud.module.css'

export function SandboxHud() {
  const G = useNewton((s) => s.sandboxG)
  const paused = useNewton((s) => s.sandboxPaused)
  const trails = useNewton((s) => s.sandboxTrails)
  const showForce = useNewton((s) => s.showForce)
  const placeMode = useNewton((s) => s.placeMode)
  const selectedId = useNewton((s) => s.selectedSandboxId)
  const bodies = useNewton((s) => s.sandboxBodies)
  const selected = bodies.find((b) => b.id === selectedId)
  const esc = sandboxEscapeInfo()

  return (
    <HudShell lab="03" title="Gravity sandbox">
      <div className={styles.row}>
        <span className={styles.label}>Run</span>
        <button type="button" onClick={() => newtonStore.toggleSandboxPause()}>
          {paused ? 'Play' : 'Pause'}
        </button>
        <button type="button" onClick={() => newtonStore.resetSandbox()}>
          Reset scene
        </button>
        <button
          type="button"
          className={trails ? styles.active : undefined}
          onClick={() => newtonStore.toggleTrails()}
        >
          Trails
        </button>
        <button
          type="button"
          className={showForce ? styles.active : undefined}
          onClick={() => newtonStore.toggleForce()}
        >
          Force
        </button>
      </div>

      <div className={styles.sliderBlock}>
        <div className={styles.sliderHeader}>
          <span>G (toy)</span>
          <strong>{G.toFixed(2)}</strong>
        </div>
        <input
          type="range"
          min={0.3}
          max={8}
          step={0.05}
          value={G}
          onChange={(e) => newtonStore.setSandboxG(Number(e.target.value))}
          aria-label="Sandbox gravitational constant"
        />
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Place</span>
        <button
          type="button"
          className={placeMode === 'mass' ? styles.active : undefined}
          onClick={() =>
            newtonStore.setPlaceMode(placeMode === 'mass' ? null : 'mass')
          }
        >
          Mass
        </button>
        <button
          type="button"
          className={placeMode === 'particle' ? styles.active : undefined}
          onClick={() =>
            newtonStore.setPlaceMode(placeMode === 'particle' ? null : 'particle')
          }
        >
          Test particle
        </button>
        <button
          type="button"
          disabled={!selectedId || selectedId === 'central'}
          onClick={() => newtonStore.removeSelected()}
        >
          Delete
        </button>
      </div>

      {selected && !selected.fixed && (
        <div className={styles.sliderBlock}>
          <div className={styles.sliderHeader}>
            <span>Selected mass</span>
            <strong>{selected.mass.toFixed(1)}</strong>
          </div>
          <input
            type="range"
            min={0.2}
            max={30}
            step={0.1}
            value={selected.mass}
            onChange={(e) => newtonStore.setSelectedMass(Number(e.target.value))}
          />
          <div className={styles.sliderHeader}>
            <span>|v| boost</span>
            <strong>{Math.hypot(selected.vx, selected.vz).toFixed(2)}</strong>
          </div>
          <div className={styles.row}>
            <button
              type="button"
              onClick={() => {
                const f = 0.85
                newtonStore.setSelectedVelocity(selected.vx * f, selected.vz * f)
              }}
            >
              Slower
            </button>
            <button
              type="button"
              onClick={() => {
                const f = 1.15
                newtonStore.setSelectedVelocity(selected.vx * f, selected.vz * f)
              }}
            >
              Faster
            </button>
            {esc && (
              <button
                type="button"
                onClick={() => {
                  const central = bodies.find((b) => b.fixed)
                  if (!central) return
                  const dx = selected.x - central.x
                  const dz = selected.z - central.z
                  const r = Math.hypot(dx, dz) || 1
                  const speed = esc.vesc * 1.05
                  // tangential escape-ish
                  newtonStore.setSelectedVelocity((-dz / r) * speed, (dx / r) * speed)
                }}
              >
                Nudge escape
              </button>
            )}
          </div>
        </div>
      )}

      <div className={styles.readouts}>
        {esc && selected && !selected.fixed ? (
          <>
            <div>
              <span className={styles.k}>Distance r</span>
              <span className={styles.v}>{esc.r.toFixed(2)}</span>
            </div>
            <div>
              <span className={styles.k}>Speed |v|</span>
              <span className={styles.v}>{esc.v.toFixed(2)}</span>
            </div>
            <div>
              <span className={styles.k}>Escape v_esc</span>
              <span className={styles.v}>{esc.vesc.toFixed(2)}</span>
            </div>
            <div>
              <span className={styles.k}>Bound?</span>
              <span className={styles.v}>{esc.bound ? 'Yes (ellipse-ish)' : 'No (escape)'}</span>
            </div>
          </>
        ) : (
          <div className={styles.modelTag}>Select a moving body for escape-speed readout.</div>
        )}
        <div className={styles.modelTag}>
          a = GM/r² pulls toward mass. Click plane while Place is active to drop a mass or test
          particle (auto circular-ish velocity). Green = velocity, red = force on selection. Toy G —
          not SI units.
        </div>
      </div>
    </HudShell>
  )
}
