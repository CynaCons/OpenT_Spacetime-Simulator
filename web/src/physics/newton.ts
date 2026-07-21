/**
 * Newtonian / Kepler helpers for the solar-system and sandbox labs.
 * Pedagogical units; not for mission design.
 */

/** Gravitational parameter of the Sun in AU³ / day² (approx). */
export const MU_SUN_AU3_DAY2 = 0.0002959122082855911 // ≈ 4π² (Kepler with a in AU, T in years: T²=a³)

/** Convert Earth days → years */
export function daysToYears(days: number): number {
  return days / 365.25
}

/** Kepler III for Sun-dominated system: T² = a³ (T in years, a in AU). */
export function keplerPeriodYears(aAu: number): number {
  return Math.sqrt(Math.pow(aAu, 3))
}

/** Circular orbital speed in AU/day for central μ. */
export function circularSpeedAuPerDay(aAu: number, mu = MU_SUN_AU3_DAY2): number {
  return Math.sqrt(mu / Math.max(aAu, 1e-9))
}

/** Acceleration magnitude a = μ / r² (AU/day²). */
export function accelMagnitude(rAu: number, mu = MU_SUN_AU3_DAY2): number {
  const r = Math.max(rAu, 1e-9)
  return mu / (r * r)
}

/** Newtonian G in toy sandbox units (scene units³ / mass / time²). Tunable. */
export const SANDBOX_G0 = 2.5

export function sandboxAccel(
  from: { x: number; y: number; z: number },
  toMass: { x: number; y: number; z: number; mass: number },
  G: number,
): { x: number; y: number; z: number } {
  const dx = toMass.x - from.x
  const dy = toMass.y - from.y
  const dz = toMass.z - from.z
  const r2 = dx * dx + dy * dy + dz * dz + 1e-6
  const r = Math.sqrt(r2)
  const f = (G * toMass.mass) / r2
  return { x: (f * dx) / r, y: (f * dy) / r, z: (f * dz) / r }
}

/** Escape speed from distance r of mass M: √(2GM/r) */
export function escapeSpeed(G: number, mass: number, r: number): number {
  return Math.sqrt((2 * G * mass) / Math.max(r, 1e-6))
}
