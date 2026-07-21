import { OrbitControls, Stars } from '@react-three/drei'
import { useEarthLab } from '../../state/earthLabStore'
import { RocketAscentDemo } from './RocketAscentDemo'
import { ShipHorizonDemo } from './ShipHorizonDemo'

/**
 * Chapter 1 viewport: dedicated Earth lab (not the full solar system).
 */
export function EarthLabScene() {
  const subDemo = useEarthLab((s) => s.subDemo)
  const lookMode = useEarthLab((s) => s.lookMode)

  const freeOrbit = subDemo === 'rocket' && lookMode === 'orbit'

  return (
    <>
      <Stars radius={80} depth={30} count={2500} factor={2.5} saturation={0} fade speed={0.2} />
      {subDemo === 'rocket' ? <RocketAscentDemo /> : <ShipHorizonDemo />}
      {freeOrbit && (
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.08}
          minDistance={0.5}
          maxDistance={45}
          target={[0, 0, 0]}
        />
      )}
    </>
  )
}
