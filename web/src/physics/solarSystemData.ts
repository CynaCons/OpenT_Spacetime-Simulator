/**
 * Approximate heliocentric orbital data for pedagogical visualization.
 * Distances in AU, periods in Earth days, radii in Earth radii (visual scale separate).
 * Not for navigation or mission design.
 */

export interface BodyDef {
  id: string
  name: string
  /** Semi-major axis (AU) */
  a: number
  /** Orbital period (Earth days) */
  periodDays: number
  /** Orbital inclination (deg) — kept small / zero for v0 */
  inclinationDeg: number
  /** Eccentricity (visual; circular motion used in scaffold) */
  eccentricity: number
  /** Mean radius relative to Earth ≈ 1 */
  radiusEarths: number
  /** Display color */
  color: string
  /** Visual radius scale in scene units (not true scale) */
  visualRadius: number
}

export const AU_SCENE = 12 // scene units per AU (visual)

export const SUN = {
  id: 'sun',
  name: 'Sun',
  color: '#ffcc66',
  visualRadius: 1.8,
}

/** Major planets — circular orbit scaffold */
export const PLANETS: BodyDef[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    a: 0.387,
    periodDays: 87.97,
    inclinationDeg: 7.0,
    eccentricity: 0.2056,
    radiusEarths: 0.383,
    color: '#b1b1b1',
    visualRadius: 0.22,
  },
  {
    id: 'venus',
    name: 'Venus',
    a: 0.723,
    periodDays: 224.7,
    inclinationDeg: 3.4,
    eccentricity: 0.0068,
    radiusEarths: 0.949,
    color: '#e8cda0',
    visualRadius: 0.35,
  },
  {
    id: 'earth',
    name: 'Earth',
    a: 1.0,
    periodDays: 365.25,
    inclinationDeg: 0,
    eccentricity: 0.0167,
    radiusEarths: 1,
    color: '#4f8cff',
    visualRadius: 0.38,
  },
  {
    id: 'mars',
    name: 'Mars',
    a: 1.524,
    periodDays: 686.98,
    inclinationDeg: 1.9,
    eccentricity: 0.0934,
    radiusEarths: 0.532,
    color: '#e27b58',
    visualRadius: 0.28,
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    a: 5.203,
    periodDays: 4332.59,
    inclinationDeg: 1.3,
    eccentricity: 0.0484,
    radiusEarths: 11.21,
    color: '#d9b38c',
    visualRadius: 0.95,
  },
  {
    id: 'saturn',
    name: 'Saturn',
    a: 9.537,
    periodDays: 10759.22,
    inclinationDeg: 2.5,
    eccentricity: 0.0542,
    radiusEarths: 9.45,
    color: '#f0d9a0',
    visualRadius: 0.82,
  },
  {
    id: 'uranus',
    name: 'Uranus',
    a: 19.19,
    periodDays: 30688.5,
    inclinationDeg: 0.8,
    eccentricity: 0.0472,
    radiusEarths: 4.01,
    color: '#7fdbda',
    visualRadius: 0.55,
  },
  {
    id: 'neptune',
    name: 'Neptune',
    a: 30.07,
    periodDays: 60182,
    inclinationDeg: 1.8,
    eccentricity: 0.0086,
    radiusEarths: 3.88,
    color: '#4b6cff',
    visualRadius: 0.52,
  },
]

/**
 * Moon — orbits Earth. Orbit radius is visual (real ≈ 0.00257 AU would be
 * invisible at scene scale); period and phase-rate are real.
 */
export const MOON = {
  id: 'moon',
  name: 'Moon',
  periodDays: 27.322,
  color: '#c9ccd4',
  visualRadius: 0.13,
  /** Visual orbit radius around Earth in scene units */
  orbitSceneRadius: 0.85,
}

/** Mean motion (rad / sim-day) for circular Keplerian scaffold */
export function meanMotion(periodDays: number): number {
  return (Math.PI * 2) / periodDays
}

/** Moon offset from Earth in scene units (circular, coplanar scaffold). */
export function getMoonOffset(simDays: number): [number, number, number] {
  const ang = meanMotion(MOON.periodDays) * simDays
  return [
    Math.cos(ang) * MOON.orbitSceneRadius,
    0,
    Math.sin(ang) * MOON.orbitSceneRadius,
  ]
}

export function getPlanetById(id: string): BodyDef | undefined {
  return PLANETS.find((p) => p.id === id)
}

/** Heliocentric position in scene units (circular scaffold). */
export function getBodyPosition(
  id: string,
  simDays: number,
): [number, number, number] {
  if (id === 'sun') return [0, 0, 0]
  if (id === 'moon') {
    const [ex, ey, ez] = getBodyPosition('earth', simDays)
    const [mx, my, mz] = getMoonOffset(simDays)
    return [ex + mx, ey + my, ez + mz]
  }
  const body = getPlanetById(id)
  if (!body) return [0, 0, 0]
  const r = body.a * AU_SCENE
  const angle = meanMotion(body.periodDays) * simDays
  return [Math.cos(angle) * r, 0, Math.sin(angle) * r]
}
