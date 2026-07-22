import { CHAPTERS } from '../content/chapters'
import { earthLabStore } from '../state/earthLabStore'
import { mercuryStore, useMercury } from '../state/mercuryStore'
import { newtonStore } from '../state/newtonStore'
import { simulationStore, useSimulation, type TimeSpeed } from '../state/simulationStore'
import styles from './TopBar.module.css'

const SPEEDS: TimeSpeed[] = [0, 1, 10, 50, 200]
const MERCURY_SPEEDS = [10, 40, 120, 400]

export function TopBar() {
  const chapterId = useSimulation((s) => s.chapterId)
  const speed = useSimulation((s) => s.speed)
  const paused = useSimulation((s) => s.paused)
  const simDays = useSimulation((s) => s.simDays)
  const showOrbits = useSimulation((s) => s.showOrbits)
  const showLabels = useSimulation((s) => s.showLabels)
  const selectedBodyId = useSimulation((s) => s.selectedBodyId)
  const focusMode = useSimulation((s) => s.focusMode)

  const mercuryPaused = useMercury((s) => s.paused)
  const mercurySpeed = useMercury((s) => s.speed)
  const mercuryDays = useMercury((s) => s.simDays)

  const isEarthLab = chapterId === 'earth-not-flat'
  const isSandbox = chapterId === 'gravity-sandbox'
  const isMercury = chapterId === 'mercury-anomaly'
  const isSolarChrome =
    chapterId === 'newtonian-solar-system' ||
    (!isEarthLab && !isSandbox && !isMercury)

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

      {isEarthLab && (
        <div className={styles.toggles} role="group" aria-label="Earth lab shortcuts">
          <span className={styles.groupLabel}>Ch.1</span>
          <button type="button" onClick={() => earthLabStore.setSubDemo('rocket')}>
            Rocket
          </button>
          <button type="button" onClick={() => earthLabStore.setSubDemo('ship')}>
            Ship
          </button>
          <button type="button" onClick={() => earthLabStore.setShapeModel('sphere')}>
            Sphere
          </button>
          <button type="button" onClick={() => earthLabStore.setShapeModel('flat')}>
            Flat
          </button>
          <button
            type="button"
            onClick={() => {
              earthLabStore.resetDemo()
              simulationStore.resetChapter()
            }}
          >
            Reset
          </button>
        </div>
      )}

      {isMercury && (
        <div className={styles.toggles} role="group" aria-label="Mercury lab">
          <span className={styles.groupLabel}>Ch.4</span>
          <button type="button" onClick={() => mercuryStore.togglePause()}>
            {mercuryPaused ? 'Play' : 'Pause'}
          </button>
          {MERCURY_SPEEDS.map((s) => (
            <button
              key={s}
              type="button"
              className={mercurySpeed === s && !mercuryPaused ? styles.active : undefined}
              onClick={() => mercuryStore.setSpeed(s)}
            >
              {s}×
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              mercuryStore.reset()
              mercuryStore.clearTrail()
            }}
          >
            Reset
          </button>
          <span className={styles.timeReadout}>t ≈ {mercuryDays.toFixed(0)} d</span>
        </div>
      )}

      {isSandbox && (
        <div className={styles.toggles} role="group" aria-label="Sandbox">
          <span className={styles.groupLabel}>Ch.3</span>
          <button type="button" onClick={() => newtonStore.toggleSandboxPause()}>
            Pause / Play
          </button>
          <button type="button" onClick={() => newtonStore.resetSandbox()}>
            Reset scene
          </button>
        </div>
      )}

      {isSolarChrome && (
        <>
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
            >
              Sun
            </button>
            <button
              type="button"
              className={focusMode === 'earth' ? styles.active : undefined}
              onClick={() => simulationStore.focusEarth()}
            >
              Earth
            </button>
            <button
              type="button"
              disabled={!selectedBodyId}
              className={focusMode === 'body' ? styles.active : undefined}
              onClick={() => selectedBodyId && simulationStore.focusBody(selectedBodyId)}
            >
              Selected
            </button>
            <button
              type="button"
              className={focusMode === 'free' ? styles.active : undefined}
              onClick={() => simulationStore.setFreeFocus()}
            >
              Free
            </button>
            <button type="button" onClick={() => simulationStore.resetCamera()}>
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
          </div>
        </>
      )}
    </header>
  )
}
