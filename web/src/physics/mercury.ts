/**
 * Mercury perihelion precession — pedagogical constants and orbit geometry.
 * Residual explained by GR ≈ 42.98″/century (often rounded to 43″).
 */

export const MERCURY_A_AU = 0.387098
export const MERCURY_E = 0.205630
export const MERCURY_PERIOD_DAYS = 87.969
/** Observed residual perihelion advance not accounted for by Newton (arcsec / century). */
export const MERCURY_RESIDUAL_ARCSEC_PER_CENTURY = 42.98
/** Approximate Newtonian contribution from other planets (arcsec / century) — for display only. */
export const MERCURY_NEWTON_PLANETS_ARCSEC_PER_CENTURY = 532.0
/** Total observed perihelion precession ≈ Newtonian + residual. */
export const MERCURY_TOTAL_OBSERVED_ARCSEC_PER_CENTURY =
  MERCURY_NEWTON_PLANETS_ARCSEC_PER_CENTURY + MERCURY_RESIDUAL_ARCSEC_PER_CENTURY

const ARCSEC_PER_RAD = 206264.80624709636
const DAYS_PER_CENTURY = 36525

/** Residual advance in radians per Earth day (true GR residual rate). */
export function residualPrecessionRadPerDay(): number {
  const arcsecPerDay = MERCURY_RESIDUAL_ARCSEC_PER_CENTURY / DAYS_PER_CENTURY
  return arcsecPerDay / ARCSEC_PER_RAD
}

/** Residual advance in radians per Mercury orbit (true). */
export function residualPrecessionRadPerOrbit(): number {
  return residualPrecessionRadPerDay() * MERCURY_PERIOD_DAYS
}

/**
 * Teaching rate: multiply true residual so the rosette is visible in minutes, not centuries.
 * UI must always show the real 43″/century figure.
 */
export function teachingPrecessionRadPerDay(exaggeration: number): number {
  return residualPrecessionRadPerDay() * Math.max(1, exaggeration)
}

/** Mean motion n (rad / day). */
export function meanMotion(): number {
  return (Math.PI * 2) / MERCURY_PERIOD_DAYS
}

/**
 * Solve Kepler's equation M = E - e sin E for eccentric anomaly E (radians).
 * Newton iteration; robust for Mercury's e ≈ 0.2.
 */
export function solveKepler(M: number, e: number, iters = 12): number {
  let E = M
  for (let i = 0; i < iters; i++) {
    const f = E - e * Math.sin(E) - M
    const fp = 1 - e * Math.cos(E)
    E -= f / fp
  }
  return E
}

/** True anomaly from eccentric anomaly. */
export function trueAnomaly(E: number, e: number): number {
  const cosE = Math.cos(E)
  const sinE = Math.sin(E)
  const cosNu = (cosE - e) / (1 - e * cosE)
  const sinNu = (Math.sqrt(1 - e * e) * sinE) / (1 - e * cosE)
  return Math.atan2(sinNu, cosNu)
}

/** Radial distance (AU) from true anomaly. */
export function radiusAu(nu: number, a = MERCURY_A_AU, e = MERCURY_E): number {
  return (a * (1 - e * e)) / (1 + e * Math.cos(nu))
}

/**
 * Heliocentric position in the orbital plane (scene units).
 * @param simDays time
 * @param omegaRad argument of periapsis (precessing)
 * @param auScene scene units per AU
 */
export function mercuryPosition(
  simDays: number,
  omegaRad: number,
  auScene: number,
  a = MERCURY_A_AU,
  e = MERCURY_E,
): { x: number; y: number; z: number; nu: number; rAu: number } {
  const n = meanMotion()
  const M = ((n * simDays) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2)
  const E = solveKepler(M, e)
  const nu = trueAnomaly(E, e)
  const rAu = radiusAu(nu, a, e)
  const r = rAu * auScene
  // Orbit in XZ plane; periapsis along +X when omega=0
  const ang = nu + omegaRad
  return {
    x: r * Math.cos(ang),
    y: 0,
    z: r * Math.sin(ang),
    nu,
    rAu,
  }
}

/** Sample closed ellipse points for a fixed omega (for drawing Newton orbit). */
export function sampleEllipse(
  omegaRad: number,
  auScene: number,
  segs = 128,
  a = MERCURY_A_AU,
  e = MERCURY_E,
): [number, number, number][] {
  const pts: [number, number, number][] = []
  for (let i = 0; i <= segs; i++) {
    const nu = (i / segs) * Math.PI * 2
    const rAu = radiusAu(nu, a, e)
    const r = rAu * auScene
    const ang = nu + omegaRad
    pts.push([r * Math.cos(ang), 0, r * Math.sin(ang)])
  }
  return pts
}

/** Periapsis direction unit vector in XZ for given omega. */
export function periapsisDirection(omegaRad: number): [number, number, number] {
  return [Math.cos(omegaRad), 0, Math.sin(omegaRad)]
}

/** Arcsec per century → degrees per century (for UI). */
export function arcsecPerCenturyToDeg(arcsec: number): number {
  return arcsec / 3600
}

/** Format residual for HUD. */
export function formatResidual(): string {
  return `${MERCURY_RESIDUAL_ARCSEC_PER_CENTURY.toFixed(2)}″ / century`
}
