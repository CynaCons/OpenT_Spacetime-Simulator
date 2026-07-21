/** Mean Earth radius (km). Sphere approximation for pedagogy. */
export const EARTH_RADIUS_KM = 6371

/** Scene units for one Earth radius in the Earth lab. */
export const EARTH_RADIUS_SCENE = 5

/**
 * Geometric horizon distance for an observer at height h above a sphere of radius R.
 * d = √(2 R h + h²)
 */
export function horizonDistanceKm(altitudeKm: number, radiusKm = EARTH_RADIUS_KM): number {
  const h = Math.max(0, altitudeKm)
  const R = radiusKm
  return Math.sqrt(2 * R * h + h * h)
}

/**
 * Dip of the horizon below local horizontal (radians).
 * cos(θ) = R / (R+h)  →  θ = acos(R/(R+h))
 */
export function horizonDipRad(altitudeKm: number, radiusKm = EARTH_RADIUS_KM): number {
  const h = Math.max(0, altitudeKm)
  const R = radiusKm
  return Math.acos(R / (R + h))
}

export function horizonDipDeg(altitudeKm: number, radiusKm = EARTH_RADIUS_KM): number {
  return (horizonDipRad(altitudeKm, radiusKm) * 180) / Math.PI
}

/**
 * Map pedagogical altitude (km) to scene height above surface.
 * Teaching exaggeration makes low-altitude curvature visible.
 */
export function altitudeKmToSceneHeight(
  altitudeKm: number,
  exaggerated: boolean,
  radiusScene = EARTH_RADIUS_SCENE,
): number {
  const h = Math.max(0, altitudeKm)
  if (!exaggerated) {
    // True-ish scale: 6371 km → EARTH_RADIUS_SCENE
    return (h / EARTH_RADIUS_KM) * radiusScene
  }
  // Teaching scale: 400 km real ≈ 0.55 R_scene (clear limb), soft-cap beyond
  const refKm = 400
  const refFraction = 0.55
  const t = h / refKm
  // ease-out so high altitudes still grow but slower
  const eased = 1 - Math.exp(-t)
  return eased * refFraction * radiusScene * (1 + 0.35 * Math.min(h / 2000, 1))
}

/** Fraction of Earth disk visible-ish cue for UI (0–1, soft). */
export function visibleGlobeHint(altitudeKm: number): number {
  const d = horizonDistanceKm(altitudeKm)
  return Math.min(1, d / (Math.PI * EARTH_RADIUS_KM))
}

export function formatKm(km: number): string {
  if (km >= 1000) return `${(km / 1000).toFixed(2)} × 10³ km`
  if (km >= 100) return `${km.toFixed(0)} km`
  if (km >= 10) return `${km.toFixed(1)} km`
  return `${km.toFixed(2)} km`
}
