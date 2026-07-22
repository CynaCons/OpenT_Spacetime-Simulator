import { grStore, useGr } from '../state/grStore'
import styles from './EarthLabHud.module.css'

export function GrHud() {
  const mass = useGr((s) => s.massSolar)
  const picture = useGr((s) => s.picture)
  const showPhoton = useGr((s) => s.showPhoton)
  const showGrid = useGr((s) => s.showGrid)
  const focus = useGr((s) => s.focusBody)
  const paused = useGr((s) => s.paused)
  const speed = useGr((s) => s.speed)

  return (
    <div className={styles.hud}>
      <div className={styles.sliderBlock}>
        <div className={styles.sliderHeader}>
          <span>Central mass</span>
          <strong>{mass.toFixed(1)} M☉</strong>
        </div>
        <input
          type="range"
          min={0.3}
          max={4}
          step={0.05}
          value={mass}
          onChange={(e) => grStore.setMass(Number(e.target.value))}
        />
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Picture</span>
        {(
          [
            ['geodesic', 'Geodesic'],
            ['force', 'Force'],
            ['both', 'Both'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={picture === id ? styles.active : undefined}
            onClick={() => grStore.setPicture(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Focus</span>
        {(['mercury', 'earth', 'jupiter'] as const).map((id) => (
          <button
            key={id}
            type="button"
            className={focus === id ? styles.active : undefined}
            onClick={() => grStore.setFocusBody(id)}
          >
            {id[0].toUpperCase() + id.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.row}>
        <button type="button" onClick={() => grStore.togglePause()}>
          {paused ? 'Play' : 'Pause'}
        </button>
        {[0.5, 1, 2, 4].map((s) => (
          <button
            key={s}
            type="button"
            className={speed === s && !paused ? styles.active : undefined}
            onClick={() => grStore.setSpeed(s)}
          >
            {s}×
          </button>
        ))}
        <button
          type="button"
          className={showGrid ? styles.active : undefined}
          onClick={() => grStore.toggleGrid()}
        >
          Grid
        </button>
        <button
          type="button"
          className={showPhoton ? styles.active : undefined}
          onClick={() => grStore.togglePhoton()}
        >
          Photon
        </button>
        <button type="button" onClick={() => grStore.reset()}>
          Reset
        </button>
      </div>

      <div className={styles.readouts}>
        <div className={styles.modelTag}>
          <strong>Geodesic picture:</strong> free-fall is inertial motion on curved spacetime —
          no “force” needed in the GR description. <strong>Force picture:</strong> Newton’s
          inverse-square pull (red arrows) is an excellent weak-field approximation.
        </div>
        <div className={styles.modelTag}>
          Mercury’s geodesic shows a little extra precession as mass rises — same residual story
          as Chapter 4. Yellow curve: light bent near the mass (bridge to 1919 eclipse).
        </div>
        <div className={styles.modelTag}>
          Honesty: the “rubber sheet” is a 2D embedding metaphor. Real spacetime is 4D; curvature
          is intrinsic.
        </div>
      </div>
    </div>
  )
}
