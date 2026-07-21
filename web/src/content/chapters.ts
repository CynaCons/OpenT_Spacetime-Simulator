/**
 * Chapter content schema for the guided story arc.
 */

export type ChapterStatus = 'available' | 'scaffold' | 'planned'

export interface Chapter {
  id: string
  index: number
  title: string
  shortTitle: string
  model: string
  status: ChapterStatus
  summary: string
  whatWeShow: string[]
  equations: string[]
  verified: string
  honestyNote?: string
  demoIds: string[]
  /** Extra teaching bullets shown in the panel when present */
  howToExplore?: string[]
}

export const CHAPTERS: Chapter[] = [
  {
    id: 'earth-not-flat',
    index: 1,
    title: 'Earth is not flat',
    shortTitle: '1 · Sphere',
    model: 'Geometry & observation',
    status: 'available',
    summary:
      'Launch a small rocket and watch how the horizon behaves. On a sphere, the limb curves and the horizon dips as you climb. On a flat disk with the same flight, the world stays a plane — the two models make different predictions you can see side by side.',
    whatWeShow: [
      'Rocket ascent with altitude scrubber and auto-launch',
      'Sphere Earth vs flat-disk model (same rocket path)',
      'Horizon distance and dip readouts from sphere geometry',
      'Ship sailing away: hull hides behind the curve on a sphere',
      'Teaching scale vs near-true vertical scale',
    ],
    equations: [
      'd_horizon ≈ √(2 R h + h²)',
      'cos(dip) = R / (R + h)',
      'C = 2 π R  (circumference)',
    ],
    verified:
      'Observer geometry: horizon distance and dip grow with height only if the surface curves away. Whole-disk views from altitude match a globe, not a flat plane under the same local “up.”',
    honestyNote:
      'Earth is an oblate spheroid (not a perfect sphere). Atmosphere and refraction shift real horizons slightly. “Teaching scale” exaggerates height so curvature is obvious in a short session — toggle near-true scale to feel how subtle low-altitude curvature is.',
    demoIds: ['D0', 'D1', 'D2'],
    howToExplore: [
      'Start on Sphere Earth, Launch or scrub altitude — watch the gold horizon guide and limb.',
      'Switch to Flat disk at the same altitude — the guide stays a flat ring; no planetary limb.',
      'Open Ship / horizon: sail past ~19 km (eye-level horizon) on sphere vs flat.',
      'Use Orbit free look to inspect the globe after climbing.',
    ],
  },
  {
    id: 'newtonian-solar-system',
    index: 2,
    title: 'Newtonian gravity & the solar system',
    shortTitle: '2 · Newton',
    model: 'Newtonian gravity / Kepler',
    status: 'scaffold',
    summary:
      'The solar system under Newton’s inverse-square law and Kepler’s laws — an extraordinarily successful model for centuries.',
    whatWeShow: [
      'Sun and planets on orbital paths',
      'Periods and distances',
      'Force / velocity vectors (planned)',
    ],
    equations: ['F = G m₁ m₂ / r²', 'T² ∝ a³ (Kepler III)'],
    verified:
      'Planetary motions to high accuracy for most purposes; foundation of classical celestial mechanics.',
    demoIds: ['D4', 'D5'],
  },
  {
    id: 'gravity-sandbox',
    index: 3,
    title: 'Gravity pull sandbox',
    shortTitle: '3 · Sandbox',
    model: 'Newtonian toy model',
    status: 'planned',
    summary:
      'Hands-on inverse-square intuition: place masses, launch test particles, and feel how gravity falls off with distance.',
    whatWeShow: ['Interactive masses', 'Trails and orbits', 'Escape velocity experiments'],
    equations: ['a = GM / r²', 'v_esc = √(2GM / r)'],
    verified: 'Pedagogical verification of inverse-square behavior (toy parameters allowed).',
    demoIds: ['D6'],
  },
  {
    id: 'mercury-anomaly',
    index: 4,
    title: 'Where Newton fails — Mercury',
    shortTitle: '4 · Mercury',
    model: 'Newtonian residual',
    status: 'planned',
    summary:
      'Mercury’s perihelion precesses slightly more than Newtonian gravity (including other planets) can explain — a ~43″/century residual. Not to be confused with apparent retrograde motion.',
    whatWeShow: [
      'Exaggerated perihelion precession for visibility',
      'Newton residual vs observation',
      'Historical context (Le Verrier, Vulcan)',
    ],
    equations: ['Δω residual ≈ 43″ / century (observed − Newtonian)'],
    verified: 'The residual is real; Newton alone cannot account for it.',
    honestyNote: 'Visual precession is exaggerated so the effect is visible in a short session.',
    demoIds: ['D7'],
  },
  {
    id: 'special-relativity',
    index: 5,
    title: 'Special Relativity',
    shortTitle: '5 · SR',
    model: 'Special Relativity',
    status: 'planned',
    summary:
      'Time dilation and related effects when relative speeds are a non-negligible fraction of c — essential for understanding GPS clocks.',
    whatWeShow: ['Light clock', 'Time dilation factor γ', 'Length contraction / simultaneity (planned)'],
    equations: ['γ = 1 / √(1 − v²/c²)', "Δt' = γ Δt"],
    verified: 'Particle lifetimes, atomic clocks on aircraft/satellites, collider physics, and more.',
    demoIds: ['D8', 'D9'],
  },
  {
    id: 'general-relativity',
    index: 6,
    title: 'General Relativity & geodesics',
    shortTitle: '6 · GR',
    model: 'General Relativity (weak-field pedagogy)',
    status: 'planned',
    summary:
      'Gravity as spacetime curvature. Free-fall paths are geodesics — the “straightest” possible paths in curved spacetime. Explore solar-system geodesics in 3D.',
    whatWeShow: [
      'Warped spacetime grid (metaphor + caveats)',
      'Planetary geodesics',
      'Newton force picture vs GR geodesic picture',
    ],
    equations: ['Geodesic equation (schematic)', 'Weak-field perihelion advance (display form)'],
    verified: 'Solar-system tests, light deflection, clock rates in gravity wells, etc.',
    honestyNote: 'Embedded 3D “fabric” visuals are teaching metaphors, not literal 4D spacetime.',
    demoIds: ['D10', 'D11'],
  },
  {
    id: 'proofs-of-gr',
    index: 7,
    title: 'Proofs that GR works',
    shortTitle: '7 · Proofs',
    model: 'Experimental confirmation',
    status: 'planned',
    summary:
      'Landmark confirmations: the 1919 solar eclipse light-deflection measurements, and the everyday necessity of SR+GR corrections for GPS.',
    whatWeShow: [
      '1919 eclipse starlight deflection demo',
      'GPS clock corrections & map-error accumulation',
      'Proof gallery for further experiments',
    ],
    equations: [
      'δ = 4GM / (c² b)  (light deflection)',
      'GPS: SR (velocity) + GR (gravitational redshift)',
    ],
    verified:
      'GR light deflection (eclipse and modern radio measurements); GNSS systems operationally require relativistic clock models.',
    demoIds: ['D12', 'D13'],
  },
]

export function getChapter(id: string): Chapter | undefined {
  return CHAPTERS.find((c) => c.id === id)
}
