import { altitudeKmToSceneHeight, EARTH_RADIUS_SCENE } from '../../physics/earthGeometry'
import type { EarthShapeModel } from '../../state/earthLabStore'
import { Vector3 } from 'three'

/** World-space rocket / pad position for the current lab state. */
export function getRocketWorldPosition(
  altitudeKm: number,
  exaggerated: boolean,
  shapeModel: EarthShapeModel,
  out = new Vector3(),
): Vector3 {
  const h = altitudeKmToSceneHeight(altitudeKm, exaggerated)
  if (shapeModel === 'flat') {
    return out.set(0, h, 0)
  }
  return out.set(0, EARTH_RADIUS_SCENE + h, 0)
}

