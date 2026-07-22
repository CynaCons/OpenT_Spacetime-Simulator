import { grStore, useGr } from '../state/grStore'
import { HudShell } from './HudShell'
import styles from './EarthLabHud.module.css'

export function GrHud() {
  const mass = useGr((s) => s.massSolar)
  const picture = useGr((s) => s.picture)
  const showPhoton = useGr((s) => s.showPhoton)
  const showGrid = useGr((s) => s.showGrid)
  const focus = useGr((s) => s.focusBody)
  const paused = useGr((s) => s.paused)
  const speed = useGr((s) => s.speed)
  const probePhase = useGr((s) => s.probePhase)
  const probeR = useGr((s) => s.probeR)
  const probeR0 = useGr((s) => s.probeR0)
  const probeV = useGr((s) => s.probeV)

  return (
    <HudShell lab="06" title="Spacetime geodesics">
      <div className={styles.row}>
        <span className={styles.label}>Probe</span>
        <button type="button" onClick={() => grStore.releaseProbe()}>
          {probePhase === 'falling' ? 'Release again' : 'Release probe'}
        </button>
        <button type="button" onClick={() => grStore.resetProbe()}>
          Reset probe
        </button>
      </div>

      <div className={styles.sliderBlock}>
        <div className={styles.sliderHeader}>
          <span>Release radius</span>
          <strong>{probeR0.toFixed(1)}</strong>
        </div>
        <input
          type="range"
          min={3}
          max={10}
          step={0.1}
          value={probeR0}
          onChange={(e) => grStore.setProbeR0(Number(e.target.value))}
          aria-label="Probe release radius"
        />
      </div>

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
          aria-label="Central mass in solar masses"
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
          Reset all
        </button>
      </div>

      <div className={styles.readouts}>
        <div>
          <span className={styles.k}>Probe radius</span>
          <span className={styles.v}>{probeR.toFixed(2)}</span>
        </div>
        <div>
          <span className={styles.k}>Probe speed</span>
          <span className={styles.v}>{Math.abs(probeV).toFixed(2)}</span>
        </div>
        <div className={styles.modelTag}>
          <strong>Falling, explained.</strong> Nothing pulls the green probe. Released at rest, it
          follows the straightest possible path through curved spacetime — and near mass, that
          path bends inward. That is what falling <em>is</em>. Lower the mass: the fabric
          flattens and the same release barely moves. The grey ghost shows flat spacetime, where
          a probe at rest simply stays.
        </div>
        <div className={styles.modelTag}>
          The planets — and the little Moon circling Earth — are doing the same thing: falling
          forever along geodesics that happen to close into orbits. Newton's red arrows describe
          the identical motion as a force; GR says it is geometry.
        </div>
        <div className={styles.modelTag}>
          Honesty: this "rubber sheet" is a 2D embedding metaphor. Real spacetime curvature is
          4D and intrinsic — but the geodesic idea carries over exactly.
        </div>
      </div>
    </HudShell>
  )
}
