import {
  EARTH_RADIUS_KM,
  formatKm,
  horizonDipDeg,
  horizonDistanceKm,
} from '../physics/earthGeometry'
import {
  EARTH_LAB_LIMITS,
  earthLabStore,
  useEarthLab,
} from '../state/earthLabStore'
import styles from './EarthLabHud.module.css'

export function EarthLabHud() {
  const subDemo = useEarthLab((s) => s.subDemo)
  const shapeModel = useEarthLab((s) => s.shapeModel)
  const altitudeKm = useEarthLab((s) => s.altitudeKm)
  const launching = useEarthLab((s) => s.launching)
  const exaggerated = useEarthLab((s) => s.exaggerated)
  const lookMode = useEarthLab((s) => s.lookMode)
  const showGrid = useEarthLab((s) => s.showGrid)
  const showHorizonGuide = useEarthLab((s) => s.showHorizonGuide)
  const shipDistanceKm = useEarthLab((s) => s.shipDistanceKm)
  const shipPlaying = useEarthLab((s) => s.shipPlaying)

  const horizonKm = horizonDistanceKm(altitudeKm)
  const dip = horizonDipDeg(altitudeKm)
  const shipHorizon = horizonDistanceKm(0.03)

  return (
    <div className={styles.hud}>
      <div className={styles.row}>
        <span className={styles.label}>Demo</span>
        <button
          type="button"
          className={subDemo === 'rocket' ? styles.active : undefined}
          onClick={() => earthLabStore.setSubDemo('rocket')}
        >
          Rocket ascent
        </button>
        <button
          type="button"
          className={subDemo === 'ship' ? styles.active : undefined}
          onClick={() => earthLabStore.setSubDemo('ship')}
        >
          Ship / horizon
        </button>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Model</span>
        <button
          type="button"
          className={shapeModel === 'sphere' ? styles.active : undefined}
          onClick={() => earthLabStore.setShapeModel('sphere')}
        >
          Sphere Earth
        </button>
        <button
          type="button"
          className={shapeModel === 'flat' ? styles.activeFlat : undefined}
          onClick={() => earthLabStore.setShapeModel('flat')}
        >
          Flat disk
        </button>
      </div>

      {subDemo === 'rocket' ? (
        <>
          <div className={styles.sliderBlock}>
            <div className={styles.sliderHeader}>
              <span>Altitude</span>
              <strong>{formatKm(altitudeKm)}</strong>
            </div>
            <input
              type="range"
              min={0}
              max={EARTH_LAB_LIMITS.maxAltitudeKm}
              step={1}
              value={altitudeKm}
              onChange={(e) => {
                earthLabStore.setLaunching(false)
                earthLabStore.setAltitudeKm(Number(e.target.value))
              }}
              aria-label="Rocket altitude in kilometers"
            />
            <div className={styles.row}>
              <button type="button" onClick={() => earthLabStore.toggleLaunch()}>
                {launching ? 'Pause launch' : 'Launch'}
              </button>
              <button type="button" onClick={() => earthLabStore.resetDemo()}>
                Reset
              </button>
              <button
                type="button"
                className={exaggerated ? styles.active : undefined}
                onClick={() => earthLabStore.setExaggerated(!exaggerated)}
                title="Exaggerate scene height so curvature is easy to see"
              >
                {exaggerated ? 'Teaching scale' : 'Near-true scale'}
              </button>
            </div>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Look</span>
            {(['horizon', 'nadir', 'orbit'] as const).map((m) => (
              <button
                key={m}
                type="button"
                className={lookMode === m ? styles.active : undefined}
                onClick={() => earthLabStore.setLookMode(m, true)}
                title={
                  m === 'horizon'
                    ? 'Snap to horizon ride (drag anytime to free the camera)'
                    : m === 'nadir'
                      ? 'Snap looking down at Earth'
                      : 'Free orbit — drag to rotate, scroll to zoom'
                }
              >
                {m === 'horizon' ? 'Horizon' : m === 'nadir' ? 'Down' : 'Free orbit'}
              </button>
            ))}
          </div>

          <div className={styles.readouts}>
            <div>
              <span className={styles.k}>Horizon distance</span>
              <span className={styles.v}>{formatKm(horizonKm)}</span>
            </div>
            <div>
              <span className={styles.k}>Horizon dip</span>
              <span className={styles.v}>{dip.toFixed(2)}°</span>
            </div>
            <div>
              <span className={styles.k}>R_Earth</span>
              <span className={styles.v}>{EARTH_RADIUS_KM} km</span>
            </div>
            <div className={styles.modelTag}>
              {shapeModel === 'sphere'
                ? 'Sphere: limb curves; dip grows with height.'
                : 'Flat: plane stays flat; no geometric limb curve.'}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={styles.sliderBlock}>
            <div className={styles.sliderHeader}>
              <span>Ship distance</span>
              <strong>{formatKm(shipDistanceKm)}</strong>
            </div>
            <input
              type="range"
              min={0}
              max={EARTH_LAB_LIMITS.maxShipKm}
              step={1}
              value={shipDistanceKm}
              onChange={(e) => {
                earthLabStore.setShipPlaying(false)
                earthLabStore.setShipDistanceKm(Number(e.target.value))
              }}
              aria-label="Ship distance in kilometers"
            />
            <div className={styles.row}>
              <button type="button" onClick={() => earthLabStore.toggleShipPlay()}>
                {shipPlaying ? 'Pause' : 'Sail away'}
              </button>
              <button type="button" onClick={() => earthLabStore.resetDemo()}>
                Reset
              </button>
            </div>
          </div>
          <div className={styles.readouts}>
            <div>
              <span className={styles.k}>Horizon (eye ~30 m)</span>
              <span className={styles.v}>{formatKm(shipHorizon)}</span>
            </div>
            <div className={styles.modelTag}>
              {shapeModel === 'sphere'
                ? shipDistanceKm > shipHorizon
                  ? 'Beyond horizon: hull hides behind the curve.'
                  : 'Still this side of the geometric horizon.'
                : 'Flat disk: ship stays visible — only shrinks with distance.'}
            </div>
          </div>
        </>
      )}

      <div className={styles.row}>
        <button
          type="button"
          className={showGrid ? styles.active : undefined}
          onClick={() => earthLabStore.toggleGrid()}
        >
          Grid
        </button>
        {subDemo === 'rocket' && (
          <button
            type="button"
            className={showHorizonGuide ? styles.active : undefined}
            onClick={() => earthLabStore.toggleHorizonGuide()}
          >
            Horizon guide
          </button>
        )}
      </div>
    </div>
  )
}
