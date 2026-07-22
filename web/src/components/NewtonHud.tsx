import { PLANETS } from '../physics/solarSystemData'
import { focusTourBody, planetNewtonStats } from '../scenes/SolarSystemScene'
import { newtonStore, useNewton } from '../state/newtonStore'
import { useSimulation } from '../state/simulationStore'
import { HudShell } from './HudShell'
import styles from './EarthLabHud.module.css'

export function NewtonHud() {
  const showVelocity = useNewton((s) => s.showVelocity)
  const showForce = useNewton((s) => s.showForce)
  const showPeriods = useNewton((s) => s.showPeriods)
  const tourBodyId = useNewton((s) => s.tourBodyId)
  const simDays = useSimulation((s) => s.simDays)
  const stats = tourBodyId ? planetNewtonStats(tourBodyId, simDays) : null

  return (
    <HudShell lab="02" title="Newtonian solar system">
      <div className={styles.row}>
        <span className={styles.label}>Vectors</span>
        <button
          type="button"
          className={showVelocity ? styles.active : undefined}
          onClick={() => newtonStore.toggleVelocity()}
        >
          Velocity
        </button>
        <button
          type="button"
          className={showForce ? styles.active : undefined}
          onClick={() => newtonStore.toggleForce()}
        >
          Force
        </button>
        <button
          type="button"
          className={showPeriods ? styles.active : undefined}
          onClick={() => newtonStore.togglePeriods()}
        >
          Periods
        </button>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Tour</span>
        {PLANETS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={tourBodyId === p.id ? styles.active : undefined}
            onClick={() => focusTourBody(p.id)}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className={styles.readouts}>
        {stats ? (
          <>
            <div>
              <span className={styles.k}>Body</span>
              <span className={styles.v}>{stats.name}</span>
            </div>
            <div>
              <span className={styles.k}>Semi-major a</span>
              <span className={styles.v}>{stats.aAu.toFixed(3)} AU</span>
            </div>
            <div>
              <span className={styles.k}>Period T</span>
              <span className={styles.v}>
                {stats.periodYears < 1
                  ? `${stats.periodDays.toFixed(1)} d`
                  : `${stats.periodYears.toFixed(2)} y`}
              </span>
            </div>
            <div>
              <span className={styles.k}>Kepler check</span>
              <span className={styles.v}>
                T²/a³ ≈{' '}
                {(
                  (stats.periodYears * stats.periodYears) /
                  Math.pow(stats.aAu, 3)
                ).toFixed(3)}
              </span>
            </div>
            <div>
              <span className={styles.k}>v_circ (toy)</span>
              <span className={styles.v}>{stats.vAuPerDay.toExponential(2)} AU/d</span>
            </div>
            <div>
              <span className={styles.k}>|a| = μ/r²</span>
              <span className={styles.v}>{stats.accel.toExponential(2)}</span>
            </div>
          </>
        ) : (
          <div className={styles.modelTag}>Select a planet for Newtonian stats.</div>
        )}
        <div className={styles.modelTag}>
          Green arrows = velocity (tangent). Red arrows = gravitational acceleration toward the
          Sun (F = GMm/r²). Kepler III: T² ∝ a³. Use time controls in the top bar.
        </div>
      </div>
    </HudShell>
  )
}
