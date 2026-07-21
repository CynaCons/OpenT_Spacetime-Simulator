import { CHAPTERS } from '../content/chapters'
import { simulationStore, useSimulation, type TimeSpeed } from '../state/simulationStore'
import styles from './TopBar.module.css'

const SPEEDS: TimeSpeed[] = [0, 1, 10, 50, 200]

export function TopBar() {
  const chapterId = useSimulation((s) => s.chapterId)
  const speed = useSimulation((s) => s.speed)
  const paused = useSimulation((s) => s.paused)
  const simDays = useSimulation((s) => s.simDays)
  const showOrbits = useSimulation((s) => s.showOrbits)
  const showLabels = useSimulation((s) => s.showLabels)
  const selectedBodyId = useSimulation((s) => s.selectedBodyId)
  const focusMode = useSimulation((s) => s.focusMode)

  return (
    <header className={styles.bar}>
      <div className={styles.brand}>
        <span className={styles.logo}>OpenT</span>
        <span className={styles.subtitle}>Spacetime Simulator</span>
      </div>

      <label className={styles.chapterSelect}>
        <span className="muted">Chapter</span>
        <select
          value={chapterId}
          onChange={(e) => simulationStore.setChapter(e.target.value)}
          aria-label="Select chapter"
        >
          {CHAPTERS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.shortTitle} — {c.title}
            </option>
          ))}
        </select>
      </label>

      <div className={styles.timeControls} role="group" aria-label="Time controls">
        <button type="button" onClick={() => simulationStore.togglePause()}>
          {paused ? 'Play' : 'Pause'}
        </button>
        {SPEEDS.filter((s) => s !== 0).map((s) => (
          <button
            key={s}
            type="button"
            className={speed === s && !paused ? styles.active : undefined}
            onClick={() => simulationStore.setSpeed(s)}
          >
            {s}×
          </button>
        ))}
        <button type="button" onClick={() => simulationStore.resetTime()}>
          Reset t
        </button>
        <span className={styles.timeReadout} title="Simulated days">
          t ≈ {simDays.toFixed(1)} d
        </span>
      </div>

      <div className={styles.toggles} role="group" aria-label="Camera focus">
        <span className={styles.groupLabel}>Center</span>
        <button
          type="button"
          className={focusMode === 'sun' ? styles.active : undefined}
          onClick={() => simulationStore.focusSun()}
          title="Orbit around the Sun"
        >
          Sun
        </button>
        <button
          type="button"
          className={focusMode === 'earth' ? styles.active : undefined}
          onClick={() => simulationStore.focusEarth()}
          title="Orbit around Earth (follows motion)"
        >
          Earth
        </button>
        <button
          type="button"
          disabled={!selectedBodyId}
          className={focusMode === 'body' ? styles.active : undefined}
          onClick={() => selectedBodyId && simulationStore.focusBody(selectedBodyId)}
          title="Orbit around the selected planet"
        >
          Selected
        </button>
        <button
          type="button"
          className={focusMode === 'free' ? styles.active : undefined}
          onClick={() => simulationStore.setFreeFocus()}
          title="Free center — pan with right mouse button, then zoom"
        >
          Free
        </button>
        <button
          type="button"
          onClick={() => simulationStore.resetCamera()}
          title="Reset camera to default Sun-centered view"
        >
          Reset view
        </button>
      </div>

      <div className={styles.toggles}>
        <button
          type="button"
          className={showOrbits ? styles.active : undefined}
          onClick={() => simulationStore.toggleOrbits()}
        >
          Orbits
        </button>
        <button
          type="button"
          className={showLabels ? styles.active : undefined}
          onClick={() => simulationStore.toggleLabels()}
        >
          Labels
        </button>
        <button type="button" onClick={() => simulationStore.resetChapter()}>
          Reset
        </button>
        {selectedBodyId && (
          <button type="button" onClick={() => simulationStore.selectBody(null)}>
            Clear select
          </button>
        )}
      </div>
    </header>
  )
}
