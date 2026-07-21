import { Canvas } from '@react-three/fiber'
import { ChapterPanel } from '../components/ChapterPanel'
import { TopBar } from '../components/TopBar'
import { CameraRig } from '../scenes/CameraRig'
import { SolarSystemScene } from '../scenes/SolarSystemScene'
import { useSimulation } from '../state/simulationStore'
import styles from './App.module.css'

function CameraHint() {
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

export function App() {
  return (
    <div className={styles.app}>
      <TopBar />
      <div className={styles.main}>
        <ChapterPanel />
        <div className={styles.viewport}>
          <Canvas
            camera={{ position: [0, 28, 42], fov: 45, near: 0.1, far: 2000 }}
            dpr={[1, 2]}
            gl={{ antialias: true }}
          >
            <SolarSystemScene />
            <CameraRig />
          </Canvas>
          <CameraHint />
        </div>
      </div>
    </div>
  )
}
