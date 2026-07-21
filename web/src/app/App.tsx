import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { ChapterPanel } from '../components/ChapterPanel'
import { TopBar } from '../components/TopBar'
import { SolarSystemScene } from '../scenes/SolarSystemScene'
import styles from './App.module.css'

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
            <OrbitControls
              makeDefault
              enableDamping
              dampingFactor={0.08}
              minDistance={4}
              maxDistance={500}
              target={[0, 0, 0]}
            />
          </Canvas>
          <div className={styles.hint}>
            Drag to orbit · Scroll to zoom · Click a planet to select
          </div>
        </div>
      </div>
    </div>
  )
}
