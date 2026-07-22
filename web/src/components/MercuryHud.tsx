import {
  MERCURY_A_AU,
  MERCURY_E,
  MERCURY_NEWTON_PLANETS_ARCSEC_PER_CENTURY,
  MERCURY_PERIOD_DAYS,
  MERCURY_TOTAL_OBSERVED_ARCSEC_PER_CENTURY,
  formatResidual,
  residualPrecessionRadPerOrbit,
} from '../physics/mercury'
import {
  EXAGGERATION_PRESETS,
  mercuryStore,
  useMercury,
  type MercuryModel,
} from '../state/mercuryStore'
import styles from './EarthLabHud.module.css'

const SPEEDS = [10, 40, 120, 400]

export function MercuryHud() {
  const model = useMercury((s) => s.model)
  const exaggeration = useMercury((s) => s.exaggeration)
  const paused = useMercury((s) => s.paused)
  const speed = useMercury((s) => s.speed)
  const showRosette = useMercury((s) => s.showRosette)
  const showPeriapsis = useMercury((s) => s.showPeriapsis)
  const showHistory = useMercury((s) => s.showHistory)
  const simDays = useMercury((s) => s.simDays)

  const residualPerOrbitArcsec =
    (residualPrecessionRadPerOrbit() * 206264.80624709636).toFixed(3)

  return (
    <div className={styles.hud}>
      <div className={styles.row}>
        <span className={styles.label}>Model</span>
        {(
          [
            ['newton', 'Newton (closed)'],
            ['residual', 'Residual (precess)'],
            ['compare', 'Compare'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={model === id ? styles.active : undefined}
            onClick={() => {
              mercuryStore.setModel(id as MercuryModel)
              if (id !== 'newton') {
                /* keep trail */
              } else {
                mercuryStore.clearTrail()
              }
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Time</span>
        <button type="button" onClick={() => mercuryStore.togglePause()}>
          {paused ? 'Play' : 'Pause'}
        </button>
        {SPEEDS.map((s) => (
          <button
            key={s}
            type="button"
            className={speed === s && !paused ? styles.active : undefined}
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
      </div>

      <div className={styles.sliderBlock}>
        <div className={styles.sliderHeader}>
          <span>Teaching exaggeration</span>
          <strong>×{exaggeration.toLocaleString()}</strong>
        </div>
        <input
          type="range"
          min={100_000}
          max={12_000_000}
          step={50_000}
          value={exaggeration}
          onChange={(e) => {
            mercuryStore.setExaggeration(Number(e.target.value))
            mercuryStore.clearTrail()
          }}
          aria-label="Precession teaching exaggeration"
        />
        <div className={styles.row}>
          {EXAGGERATION_PRESETS.map((p) => (
            <button
              key={p.value}
              type="button"
              className={exaggeration === p.value ? styles.active : undefined}
              onClick={() => {
                mercuryStore.setExaggeration(p.value)
                mercuryStore.clearTrail()
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.row}>
        <button
          type="button"
          className={showRosette ? styles.active : undefined}
          onClick={() => mercuryStore.toggleRosette()}
        >
          Rosette trail
        </button>
        <button
          type="button"
          className={showPeriapsis ? styles.active : undefined}
          onClick={() => mercuryStore.togglePeriapsis()}
        >
          Perihelion markers
        </button>
        <button
          type="button"
          className={showHistory ? styles.active : undefined}
          onClick={() => mercuryStore.toggleHistory()}
        >
          History
        </button>
      </div>

      <div className={styles.readouts}>
        <div>
          <span className={styles.k}>a (semi-major)</span>
          <span className={styles.v}>{MERCURY_A_AU} AU</span>
        </div>
        <div>
          <span className={styles.k}>Eccentricity e</span>
          <span className={styles.v}>{MERCURY_E}</span>
        </div>
        <div>
          <span className={styles.k}>Period</span>
          <span className={styles.v}>{MERCURY_PERIOD_DAYS} d</span>
        </div>
        <div>
          <span className={styles.k}>Sim time</span>
          <span className={styles.v}>{(simDays / 365.25).toFixed(2)} y</span>
        </div>
        <div>
          <span className={styles.k}>Newton (other planets)</span>
          <span className={styles.v}>
            ~{MERCURY_NEWTON_PLANETS_ARCSEC_PER_CENTURY.toFixed(0)}″ / cy
          </span>
        </div>
        <div>
          <span className={styles.k}>Residual (GR)</span>
          <span className={styles.v}>{formatResidual()}</span>
        </div>
        <div>
          <span className={styles.k}>Total observed</span>
          <span className={styles.v}>
            ~{MERCURY_TOTAL_OBSERVED_ARCSEC_PER_CENTURY.toFixed(0)}″ / cy
          </span>
        </div>
        <div>
          <span className={styles.k}>Residual / orbit</span>
          <span className={styles.v}>~{residualPerOrbitArcsec}″</span>
        </div>
        <div className={styles.modelTag}>
          <strong>Blue</strong> = pure inverse-square Kepler ellipse (perihelion fixed).{' '}
          <strong>Orange</strong> = same ellipse with the <em>residual</em> advance that Newton
          could not explain (~43″/century). Animation is hugely exaggerated so you can see the
          rosette; numbers in the readouts are the real ones.
        </div>
        <div className={styles.modelTag}>
          Not “Mercury retrograde.” Retrograde is an optical loop in the sky from Earth’s
          overtaking orbit. This demo is the slow rotation of Mercury’s closest-to-Sun point
          (perihelion).
        </div>
      </div>

      {showHistory && (
        <div className={styles.modelTag} style={{ marginTop: 0 }}>
          <strong>History (brief).</strong> Le Verrier found Mercury’s perihelion moves faster
          than Newtonian planet perturbations predict. A hypothetical planet “Vulcan” was
          proposed — never found. Einstein’s GR accounts for the residual without new planets.
          Later chapters show spacetime geodesics and experimental proofs.
        </div>
      )}
    </div>
  )
}
