import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { ChapterPanel } from '../components/ChapterPanel'
import { ChapterRail } from '../components/ChapterRail'
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
  const map: Record<Lab, string> = {
    earth: 'Drag to orbit · Scroll zoom · Sphere vs Flat · Rocket / Ship',
    sandbox: 'Place mass/particle on grid · Green = velocity · Red = force',
    mercury: 'Blue = Newton closed · Orange = residual precession · Not retrograde',
    sr: 'Light clocks · β = v/c · γ time dilation · Length contraction',
    gr: 'Warped fabric · Geodesics · Raise mass · Photon path',
    proofs: '1919 eclipse models · GPS — apply both SR + GR',
    newton: 'Vectors · Tour planets · Double-click to focus · RMB pan',
    solar: 'Drag orbit · Scroll zoom · RMB pan · Double-click body',
  }
  return (
    <div className={styles.hint}>
      {map[lab].split(' · ').map((part, i, arr) => (
        <span key={part}>
          {i === 0 ? <strong>{part}</strong> : part}
          {i < arr.length - 1 ? ' · ' : ''}
        </span>
      ))}
    </div>
  )
}

export function App() {
  const chapterId = useSimulation((s) => s.chapterId)
  const lab = labForChapter(chapterId)

  const camera =
    lab === 'earth'
      ? { position: [0, 7, 4] as [number, number, number], fov: 48, near: 0.05, far: 500 }
      : lab === 'sandbox'
        ? { position: [0, 14, 16] as [number, number, number], fov: 48, near: 0.1, far: 500 }
        : lab === 'mercury'
          ? { position: [0, 11, 15] as [number, number, number], fov: 46, near: 0.1, far: 200 }
          : lab === 'sr'
            ? { position: [0, 1.2, 11] as [number, number, number], fov: 48, near: 0.1, far: 200 }
            : lab === 'gr'
              ? { position: [9, 7.5, 11] as [number, number, number], fov: 48, near: 0.1, far: 200 }
              : lab === 'proofs'
                ? { position: [0, 2.8, 13] as [number, number, number], fov: 48, near: 0.1, far: 200 }
                : { position: [0, 26, 40] as [number, number, number], fov: 42, near: 0.1, far: 2000 }

  return (
    <div className={styles.app}>
      <TopBar />
      <div className={styles.main}>
        <ChapterPanel />
        <div className={styles.viewport}>
          <ChapterRail />
          <div className={styles.vignette} aria-hidden />
          <Canvas
            key={lab}
            camera={camera}
            dpr={[1, 1.75]}
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: 'high-performance',
            }}
            shadows={false}
          >
            <Suspense fallback={null}>
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
            </Suspense>
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
