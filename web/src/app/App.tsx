import { Canvas } from '@react-three/fiber'
import { ChapterPanel } from '../components/ChapterPanel'
import { EarthLabHud } from '../components/EarthLabHud'
import { TopBar } from '../components/TopBar'
import { CameraRig } from '../scenes/CameraRig'
import { EarthLabScene } from '../scenes/earth/EarthLabScene'
import { SolarSystemScene } from '../scenes/SolarSystemScene'
import { useSimulation } from '../state/simulationStore'
import styles from './App.module.css'

function SolarHint() {
  const focusMode = useSimulation((s) => s.focusMode)
  const focusBodyId = useSimulation((s) => s.focusBodyId)
  const centerLabel =
    focusMode === 'sun'
      ? 'Sun'
      : focusMode === 'earth'
        ? 'Earth (following)'
        : focusMode === 'body'
          ? `${focusBodyId ?? 'body'} (following)`
          : 'Free (pan to move center)'

  return (
    <div className={styles.hint}>
      Drag orbit · Scroll zoom · RMB pan = move center · Double-click body to focus · Center:{' '}
      <strong>{centerLabel}</strong>
    </div>
  )
}

function EarthHint() {
  return (
    <div className={styles.hint}>
      <strong>Drag</strong> to orbit · <strong>Scroll</strong> to zoom · RMB pan · Horizon/Down =
      snap presets (drag frees camera) · Sphere vs Flat
    </div>
  )
}

export function App() {
  const chapterId = useSimulation((s) => s.chapterId)
  const isEarthLab = chapterId === 'earth-not-flat'

  return (
    <div className={styles.app}>
      <TopBar />
      <div className={styles.main}>
        <ChapterPanel />
        <div className={styles.viewport}>
          <Canvas
            key={isEarthLab ? 'earth-lab' : 'solar'}
            camera={
              isEarthLab
                ? { position: [0, 7, 4], fov: 50, near: 0.05, far: 500 }
                : { position: [0, 28, 42], fov: 45, near: 0.1, far: 2000 }
            }
            dpr={[1, 2]}
            gl={{ antialias: true }}
          >
            {isEarthLab ? (
              <EarthLabScene />
            ) : (
              <>
                <SolarSystemScene />
                <CameraRig />
              </>
            )}
          </Canvas>
          {isEarthLab ? (
            <>
              <EarthLabHud />
              <EarthHint />
            </>
          ) : (
            <SolarHint />
          )}
        </div>
      </div>
    </div>
  )
}
