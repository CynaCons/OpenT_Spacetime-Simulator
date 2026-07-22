import { Canvas } from '@react-three/fiber'
import { ChapterPanel } from '../components/ChapterPanel'
import { EarthLabHud } from '../components/EarthLabHud'
import { GrHud } from '../components/GrHud'
import { MercuryHud } from '../components/MercuryHud'
import { NewtonHud } from '../components/NewtonHud'
import { ProofsHud } from '../components/ProofsHud'
import { SandboxHud } from '../components/SandboxHud'
import { SrHud } from '../components/SrHud'
import { TopBar } from '../components/TopBar'
import { CameraRig } from '../scenes/CameraRig'
import { EarthLabScene } from '../scenes/earth/EarthLabScene'
import { GeneralRelativityScene } from '../scenes/GeneralRelativityScene'
import { GravitySandboxScene } from '../scenes/GravitySandboxScene'
import { MercuryAnomalyScene } from '../scenes/MercuryAnomalyScene'
import { ProofsScene } from '../scenes/ProofsScene'
import { SolarSystemScene } from '../scenes/SolarSystemScene'
import { SpecialRelativityScene } from '../scenes/SpecialRelativityScene'
import { useSimulation } from '../state/simulationStore'
import styles from './App.module.css'

type Lab =
  | 'earth'
  | 'newton'
  | 'sandbox'
  | 'mercury'
  | 'sr'
  | 'gr'
  | 'proofs'
  | 'solar'

function labForChapter(id: string): Lab {
  switch (id) {
    case 'earth-not-flat':
      return 'earth'
    case 'newtonian-solar-system':
      return 'newton'
    case 'gravity-sandbox':
      return 'sandbox'
    case 'mercury-anomaly':
      return 'mercury'
    case 'special-relativity':
      return 'sr'
    case 'general-relativity':
      return 'gr'
    case 'proofs-of-gr':
      return 'proofs'
    default:
      return 'solar'
  }
}

function Hint({ lab }: { lab: Lab }) {
  if (lab === 'earth') {
    return (
      <div className={styles.hint}>
        <strong>Drag</strong> to orbit · <strong>Scroll</strong> to zoom · Sphere vs Flat · Rocket /
        Ship
      </div>
    )
  }
  if (lab === 'sandbox') {
    return (
      <div className={styles.hint}>
        Gravity sandbox · Place mass/particle · Green velocity · Red force
      </div>
    )
  }
  if (lab === 'mercury') {
    return (
      <div className={styles.hint}>
        Mercury perihelion · Blue Newton · Orange residual · Not retrograde
      </div>
    )
  }
  if (lab === 'sr') {
    return (
      <div className={styles.hint}>
        Special Relativity · Light clocks · β = v/c · γ time dilation
      </div>
    )
  }
  if (lab === 'gr') {
    return (
      <div className={styles.hint}>
        GR metaphor grid · Geodesics · Mass warps fabric · Photon path
      </div>
    )
  }
  if (lab === 'proofs') {
    return (
      <div className={styles.hint}>
        Proofs · 1919 eclipse deflection · GPS SR+GR clock corrections
      </div>
    )
  }
  return (
    <div className={styles.hint}>
      Drag orbit · Scroll zoom · RMB pan · Double-click body to focus
    </div>
  )
}

export function App() {
  const chapterId = useSimulation((s) => s.chapterId)
  const lab = labForChapter(chapterId)

  const camera =
    lab === 'earth'
      ? { position: [0, 7, 4] as [number, number, number], fov: 50, near: 0.05, far: 500 }
      : lab === 'sandbox'
        ? { position: [0, 14, 16] as [number, number, number], fov: 50, near: 0.1, far: 500 }
        : lab === 'mercury'
          ? { position: [0, 12, 16] as [number, number, number], fov: 48, near: 0.1, far: 200 }
          : lab === 'sr'
            ? { position: [0, 1, 12] as [number, number, number], fov: 50, near: 0.1, far: 200 }
            : lab === 'gr'
              ? { position: [8, 7, 12] as [number, number, number], fov: 50, near: 0.1, far: 200 }
              : lab === 'proofs'
                ? { position: [0, 3, 14] as [number, number, number], fov: 50, near: 0.1, far: 200 }
                : { position: [0, 28, 42] as [number, number, number], fov: 45, near: 0.1, far: 2000 }

  return (
    <div className={styles.app}>
      <TopBar />
      <div className={styles.main}>
        <ChapterPanel />
        <div className={styles.viewport}>
          <Canvas key={lab} camera={camera} dpr={[1, 2]} gl={{ antialias: true }}>
            {lab === 'earth' && <EarthLabScene />}
            {lab === 'sandbox' && <GravitySandboxScene />}
            {lab === 'mercury' && <MercuryAnomalyScene />}
            {lab === 'sr' && <SpecialRelativityScene />}
            {lab === 'gr' && <GeneralRelativityScene />}
            {lab === 'proofs' && <ProofsScene />}
            {(lab === 'newton' || lab === 'solar') && (
              <>
                <SolarSystemScene />
                <CameraRig />
              </>
            )}
          </Canvas>

          {lab === 'earth' && <EarthLabHud />}
          {lab === 'newton' && <NewtonHud />}
          {lab === 'sandbox' && <SandboxHud />}
          {lab === 'mercury' && <MercuryHud />}
          {lab === 'sr' && <SrHud />}
          {lab === 'gr' && <GrHud />}
          {lab === 'proofs' && <ProofsHud />}
          <Hint lab={lab} />
        </div>
      </div>
    </div>
  )
}
