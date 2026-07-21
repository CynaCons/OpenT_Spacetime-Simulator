/** Mean Earth radius (km). Sphere approximation for pedagogy. */
export const EARTH_RADIUS_KM = 6371

/** Scene units for one Earth radius in the Earth lab. */
export const EARTH_RADIUS_SCENE = 5

/** Everest summit elevation (km) — pedagogic constant. */
export const EVEREST_HEIGHT_KM = 8.849

/**
 * Surface-distance teaching map for the ship/Everest lab.
 * Real 400 km is only ~3.6° on Earth — invisible on a globe the size of the viewport.
 * We map max demo range onto a large arc so curvature is readable, while readouts stay in real km.
 */
export const SURFACE_DEMO_MAX_KM = 400
/** Arc span (radians) corresponding to SURFACE_DEMO_MAX_KM on the teaching globe. */
export const SURFACE_DEMO_ARC_RAD = (78 * Math.PI) / 180

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
 * Max ground distance at which two elevated points can still see each other
 * (geometric, no refraction): d ≈ √(2 R h₁) + √(2 R h₂)  (approx via full formula).
 */
export function mutualVisibilityKm(
  height1Km: number,
  height2Km: number,
  radiusKm = EARTH_RADIUS_KM,
): number {
  return horizonDistanceKm(height1Km, radiusKm) + horizonDistanceKm(height2Km, radiusKm)
}

/** Map real surface km → teaching angle on the lab sphere. */
export function surfaceKmToTeachingAngle(distKm: number): number {
  const t = Math.max(0, distKm) / SURFACE_DEMO_MAX_KM
  return t * SURFACE_DEMO_ARC_RAD
}

/** Point on sphere surface (XZ=0 plane) at arc distance from the north pole, toward +X. */
export function spherePointFromPole(
  distKm: number,
  radiusScene = EARTH_RADIUS_SCENE,
  out?: { x: number; y: number; z: number },
): { x: number; y: number; z: number } {
  const ang = surfaceKmToTeachingAngle(distKm)
  const x = radiusScene * Math.sin(ang)
  const y = radiusScene * Math.cos(ang)
  const z = 0
  if (out) {
    out.x = x
    out.y = y
    out.z = z
    return out
  }
  return { x, y, z }
}

/**
 * Height above surface (km) → radial offset in scene units.
 * Exaggerated slightly so masts / Everest read at teaching arc scale.
 */
export function surfaceHeightToScene(
  heightKm: number,
  exaggerated = true,
  radiusScene = EARTH_RADIUS_SCENE,
): number {
  const h = Math.max(0, heightKm)
  if (!exaggerated) {
    return (h / EARTH_RADIUS_KM) * radiusScene
  }
  // Everest ~8.85 km → ~0.22 scene units (readable cone on R=5)
  return (h / EVEREST_HEIGHT_KM) * 0.22 * (radiusScene / EARTH_RADIUS_SCENE)
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
