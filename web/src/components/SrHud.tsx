import { lorentzGamma, properTimeFraction } from '../physics/relativity'
import { srStore, useSr } from '../state/srStore'
import styles from './EarthLabHud.module.css'

export function SrHud() {
  const subDemo = useSr((s) => s.subDemo)
  const beta = useSr((s) => s.beta)
  const paused = useSr((s) => s.paused)
  const showGamma = useSr((s) => s.showGamma)
  const gamma = lorentzGamma(beta)
  const properFrac = properTimeFraction(beta)

  return (
    <div className={styles.hud}>
      <div className={styles.row}>
        <span className={styles.label}>Demo</span>
        <button
          type="button"
          className={subDemo === 'lightclock' ? styles.active : undefined}
          onClick={() => srStore.setSubDemo('lightclock')}
        >
          Light clock
        </button>
        <button
          type="button"
          className={subDemo === 'length' ? styles.active : undefined}
          onClick={() => srStore.setSubDemo('length')}
        >
          Length contraction
        </button>
      </div>

      <div className={styles.sliderBlock}>
        <div className={styles.sliderHeader}>
          <span>Speed β = v/c</span>
          <strong>{beta.toFixed(2)}</strong>
        </div>
        <input
          type="range"
          min={0}
          max={0.95}
          step={0.01}
          value={beta}
          onChange={(e) => srStore.setBeta(Number(e.target.value))}
          aria-label="Speed as fraction of c"
        />
      </div>

      <div className={styles.row}>
        <button type="button" onClick={() => srStore.togglePause()}>
          {paused ? 'Play' : 'Pause'}
        </button>
        <button type="button" onClick={() => srStore.reset()}>
          Reset
        </button>
        <button
          type="button"
          className={showGamma ? styles.active : undefined}
          onClick={() => srStore.toggleGamma()}
        >
          Show γ
        </button>
      </div>

      <div className={styles.readouts}>
        <div>
          <span className={styles.k}>γ</span>
          <span className={styles.v}>{gamma.toFixed(4)}</span>
        </div>
        <div>
          <span className={styles.k}>Δτ / Δt (moving)</span>
          <span className={styles.v}>{properFrac.toFixed(4)}</span>
        </div>
        <div className={styles.modelTag}>
          Light clock: a photon bounces between mirrors. In the lab, the moving clock’s light
          takes a longer diagonal path, so it ticks slower — time dilation. Same γ governs length
          contraction L = L₀/γ.
        </div>
        <div className={styles.modelTag}>
          GPS preview: satellites move at β ~ 1.3×10⁻⁵ — tiny γ effect, but ~−7 µs/day. Combined
          with GR (next chapters) it becomes mission-critical.
        </div>
      </div>
    </div>
  )
}
