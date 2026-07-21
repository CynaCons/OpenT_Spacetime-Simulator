import { Stars } from '@react-three/drei'
import { useEarthLab } from '../../state/earthLabStore'
import { EarthLabCamera } from './EarthLabCamera'
import { RocketAscentDemo } from './RocketAscentDemo'
import { ShipHorizonDemo } from './ShipHorizonDemo'

/**
 * Chapter 1 viewport: dedicated Earth lab (not the full solar system).
 * Camera is always orbitable — see EarthLabCamera.
 */
export function EarthLabScene() {
  const subDemo = useEarthLab((s) => s.subDemo)

  return (
    <>
      <Stars radius={80} depth={30} count={2500} factor={2.5} saturation={0} fade speed={0.2} />
      {subDemo === 'rocket' ? <RocketAscentDemo /> : <ShipHorizonDemo />}
      <EarthLabCamera />
    </>
  )
}
