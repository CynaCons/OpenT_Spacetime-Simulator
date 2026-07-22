import {
  GPS_GR_US_PER_DAY,
  GPS_NET_US_PER_DAY,
  GPS_SR_US_PER_DAY,
  SUN_DEFLECTION_GR_ARCSEC,
  SUN_DEFLECTION_NEWTON_ARCSEC,
  clockErrorUsToKm,
  deflectionArcsec,
} from '../physics/relativity'
import { proofsStore, useProofs } from '../state/proofsStore'
import styles from './EarthLabHud.module.css'

export function ProofsHud() {
  const sub = useProofs((s) => s.subDemo)
  const model = useProofs((s) => s.deflectionModel)
  const phase = useProofs((s) => s.eclipsePhase)
  const playing = useProofs((s) => s.playing)
  const gpsDays = useProofs((s) => s.gpsDays)
  const sr = useProofs((s) => s.gpsApplySR)
  const gr = useProofs((s) => s.gpsApplyGR)
  const gpsPlaying = useProofs((s) => s.gpsPlaying)

  let rate = GPS_NET_US_PER_DAY
  if (sr && gr) rate = 0
  else if (sr && !gr) rate = GPS_GR_US_PER_DAY
  else if (!sr && gr) rate = GPS_SR_US_PER_DAY
  const errKm = clockErrorUsToKm(rate * gpsDays)

  return (
    <div className={styles.hud}>
      <div className={styles.row}>
        <span className={styles.label}>Proof</span>
        <button
          type="button"
          className={sub === 'eclipse' ? styles.active : undefined}
          onClick={() => proofsStore.setSubDemo('eclipse')}
        >
          1919 eclipse
        </button>
        <button
          type="button"
          className={sub === 'gps' ? styles.active : undefined}
          onClick={() => proofsStore.setSubDemo('gps')}
        >
          GPS clocks
        </button>
      </div>

      {sub === 'eclipse' ? (
        <>
          <div className={styles.row}>
            <span className={styles.label}>δ model</span>
            {(
              [
                ['none', 'None 0″'],
                ['newton', `Newton ${SUN_DEFLECTION_NEWTON_ARCSEC}″`],
                ['gr', `GR ${SUN_DEFLECTION_GR_ARCSEC}″`],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={model === id ? styles.active : undefined}
                onClick={() => proofsStore.setDeflectionModel(id)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className={styles.sliderBlock}>
            <div className={styles.sliderHeader}>
              <span>Eclipse phase</span>
              <strong>{(phase * 100).toFixed(0)}%</strong>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={phase}
              onChange={(e) => {
                proofsStore.setEclipsePhase(Number(e.target.value))
              }}
            />
          </div>
          <div className={styles.row}>
            <button type="button" onClick={() => proofsStore.togglePlay()}>
              {playing ? 'Pause' : 'Play'}
            </button>
            <button type="button" onClick={() => proofsStore.resetEclipse()}>
              Reset
            </button>
          </div>
          <div className={styles.readouts}>
            <div>
              <span className={styles.k}>δ (this model)</span>
              <span className={styles.v}>{deflectionArcsec(model).toFixed(3)}″</span>
            </div>
            <div className={styles.modelTag}>
              Eddington’s 1919 expeditions (Sobral & Príncipe) measured starlight deflection near
              the eclipsed Sun. Results favored GR’s 1.75″ over the half-size Newtonian
              prediction. Modern radio measurements confirm GR to high precision.
            </div>
            <div className={styles.modelTag}>
              Formula (limb): δ = 4GM☉/(c²R☉) ≈ 1.75″
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={styles.row}>
            <button
              type="button"
              className={sr ? styles.active : undefined}
              onClick={() => proofsStore.setGpsApplySR(!sr)}
            >
              Apply SR
            </button>
            <button
              type="button"
              className={gr ? styles.active : undefined}
              onClick={() => proofsStore.setGpsApplyGR(!gr)}
            >
              Apply GR
            </button>
            <button type="button" onClick={() => proofsStore.toggleGpsPlay()}>
              {gpsPlaying ? 'Pause' : 'Play'}
            </button>
            <button type="button" onClick={() => proofsStore.resetGps()}>
              Reset t
            </button>
          </div>
          <div className={styles.readouts}>
            <div>
              <span className={styles.k}>Sim days</span>
              <span className={styles.v}>{gpsDays.toFixed(1)}</span>
            </div>
            <div>
              <span className={styles.k}>SR rate</span>
              <span className={styles.v}>{GPS_SR_US_PER_DAY} µs/d</span>
            </div>
            <div>
              <span className={styles.k}>GR rate</span>
              <span className={styles.v}>+{GPS_GR_US_PER_DAY} µs/d</span>
            </div>
            <div>
              <span className={styles.k}>Net if open</span>
              <span className={styles.v}>{GPS_NET_US_PER_DAY.toFixed(1)} µs/d</span>
            </div>
            <div>
              <span className={styles.k}>Map error</span>
              <span className={styles.v}>{errKm.toFixed(1)} km</span>
            </div>
            <div className={styles.modelTag}>
              Without corrections, clock errors accumulate ~38 µs/day → kilometers of ranging
              error. Toggle <strong>both</strong> SR and GR — only then does the pin stay put.
              One correction alone still drifts.
            </div>
            <div className={styles.modelTag}>
              Figures are standard order-of-magnitude teaching values (not a full GNSS simulator).
            </div>
          </div>
        </>
      )}

      <div className={styles.modelTag}>
        <strong>Proof gallery.</strong> Interactive: eclipse deflection · GPS clocks. Also
        historically important: gravitational redshift, Shapiro delay, binary pulsars, GW170817 —
        candidates for later demos.
      </div>
    </div>
  )
}
