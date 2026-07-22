/**
 * Special / General Relativity pedagogical helpers.
 * Not for navigation or mission design.
 */

/** Lorentz factor γ = 1 / √(1 − β²), β = v/c */
export function lorentzGamma(beta: number): number {
  const b = Math.min(0.999999, Math.max(0, Math.abs(beta)))
  return 1 / Math.sqrt(1 - b * b)
}

/** Proper time / lab time for a clock moving at β (lab frame). */
export function properTimeFraction(beta: number): number {
  return 1 / lorentzGamma(beta)
}

/** Length contraction: L = L0 / γ */
export function contractedLength(L0: number, beta: number): number {
  return L0 / lorentzGamma(beta)
}

/**
 * GR light deflection (total) for a ray with impact parameter b:
 * δ = 4 G M / (c² b)  (radians, Schwarzschild)
 * For the Sun, limb impact ≈ R_sun → δ ≈ 1.75″
 */
export const SUN_DEFLECTION_GR_ARCSEC = 1.75
/** Historical “Newtonian” (corpuscular / half GR) prediction often compared: 0.875″ */
export const SUN_DEFLECTION_NEWTON_ARCSEC = 0.875

export function deflectionArcsec(model: 'none' | 'newton' | 'gr'): number {
  if (model === 'none') return 0
  if (model === 'newton') return SUN_DEFLECTION_NEWTON_ARCSEC
  return SUN_DEFLECTION_GR_ARCSEC
}

/**
 * GPS clock rates (order-of-magnitude teaching figures, µs/day):
 * - Special-relativistic: satellites move fast → clocks run slow ≈ −7 µs/day
 * - General-relativistic: higher in gravity well → clocks run fast ≈ +45 µs/day
 * - Net ≈ +38 µs/day if uncorrected
 * Uncorrected position error grows ~ c × Δt  (order of ~10 km/day scale)
 */
export const GPS_SR_US_PER_DAY = -7.2
export const GPS_GR_US_PER_DAY = 45.6
export const GPS_NET_US_PER_DAY = GPS_SR_US_PER_DAY + GPS_GR_US_PER_DAY // ≈ +38.4

/** Rough map error in km from accumulated clock error (µs) — pedagogical. */
export function clockErrorUsToKm(us: number): number {
  // 1 µs × c ≈ 300 m
  return Math.abs(us) * 0.3
}

/** Schwarzschild radius parameter for teaching warp: rs ∝ M */
export function schwarzschildWarp(massSolar: number, r: number, soft = 0.4): number {
  // depression of "fabric" z = -k M / r_soft
  const rr = Math.sqrt(r * r + soft * soft)
  return (-1.2 * massSolar) / rr
}
