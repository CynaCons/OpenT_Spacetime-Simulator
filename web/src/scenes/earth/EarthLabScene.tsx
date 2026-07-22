import { useEarthLab } from '../../state/earthLabStore'
import { SceneAtmosphere } from '../shared/SceneAtmosphere'
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
      <SceneAtmosphere background="#02060f" fogNear={18} fogFar={55} starCount={3000} />
      {subDemo === 'rocket' ? <RocketAscentDemo /> : <ShipHorizonDemo />}
      <EarthLabCamera />
    </>
  )
}
