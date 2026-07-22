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
      'Ship on the curved surface: hull, then superstructure, then mast drop behind the limb',
      'Everest: how far a summit remains visible (mutual horizon geometry)',
      'Field-of-view wedge + horizon tangent ray',
      'Teaching scale vs near-true vertical scale (rocket)',
    ],
    equations: [
      'd_horizon ≈ √(2 R h + h²)',
      'd_visible ≈ √(2 R h₁) + √(2 R h₂)  (two heights)',
      'cos(dip) = R / (R + h)',
    ],
    verified:
      'Observer geometry: horizon distance and dip grow with height only if the surface curves away. Distant ships and peaks disappear hull-first / base-first — matching a sphere, not a flat plane.',
    honestyNote:
      'Earth is an oblate spheroid. Atmosphere and refraction extend real horizons slightly. In the ship lab, surface distances use a teaching arc on the globe (km labels stay real) so curvature is readable; rocket altitude has a separate teaching-scale toggle.',
    demoIds: ['D0', 'D1', 'D2'],
    howToExplore: [
      'Rocket: Launch or scrub altitude on Sphere, then flip to Flat at the same height.',
      'Ship / horizon: Sail away — watch the ship stick to the curve; hull vanishes first.',
      'Toggle Field of view: gold ray is the geometric horizon tangent; blue fan is FOV.',
      'Compare gold ring (eye horizon ~20 km) vs green ring (Everest still visible ~hundreds of km).',
      'Switch to Flat disk: ship never falls behind a limb; Everest stays “visible.”',
    ],
  },
  {
    id: 'newtonian-solar-system',
    index: 2,
    title: 'Newtonian gravity & the solar system',
    shortTitle: '2 · Newton',
    model: 'Newtonian gravity / Kepler',
    status: 'available',
    summary:
      'The solar system under Newton’s inverse-square law and Kepler’s laws — an extraordinarily successful model for centuries. Force points to the Sun; velocity is (nearly) tangent; periods obey T² ∝ a³.',
    whatWeShow: [
      'Sun and planets on orbital paths',
      'Velocity (green) and force/acceleration (red) vectors',
      'Period and semi-major axis labels; Kepler T²/a³ check',
      'Planet tour with focus + Newtonian readouts',
    ],
    equations: ['F = G m₁ m₂ / r²', 'a = GM / r²', 'T² ∝ a³ (Kepler III)'],
    verified:
      'Planetary motions to high accuracy for most purposes; foundation of classical celestial mechanics.',
    honestyNote:
      'Orbits here are circular Keplerian (visual). Real planets have small eccentricities; N-body perturbations are deferred.',
    demoIds: ['D4', 'D5'],
    howToExplore: [
      'Toggle Velocity / Force vectors on the HUD.',
      'Tour planets — check that T²/a³ ≈ 1 for each.',
      'Speed up time; double-click a planet to center the camera.',
      'Next chapter: free sandbox for inverse-square experiments.',
    ],
  },
  {
    id: 'gravity-sandbox',
    index: 3,
    title: 'Gravity pull sandbox',
    shortTitle: '3 · Sandbox',
    model: 'Newtonian toy model',
    status: 'available',
    summary:
      'Hands-on inverse-square intuition: place masses, launch test particles, watch trails, and compare speed to escape velocity. Toy units — the shape of the law matters, not SI constants.',
    whatWeShow: [
      'Central mass + orbiting test body',
      'Place extra masses or particles on the plane',
      'Trails, force vectors, adjustable G',
      'Escape-speed comparison for the selection',
    ],
    equations: ['a = GM / r²', 'v_esc = √(2GM / r)', 'F = G m₁ m₂ / r²'],
    verified: 'Pedagogical verification of inverse-square behavior (toy parameters allowed).',
    honestyNote:
      'Sandbox uses soft-softened gravity and semi-implicit Euler. Stable orbits are approximate; this is for intuition, not orbital mechanics homework precision.',
    demoIds: ['D6'],
    howToExplore: [
      'Watch the default orbiter; toggle Force and Trails.',
      'Speed up until |v| > v_esc — path opens (escape).',
      'Place a test particle; try different G values.',
      'When ready, continue to Mercury — where Newton is almost perfect… but not quite.',
    ],
  },
  {
    id: 'mercury-anomaly',
    index: 4,
    title: 'Where Newton fails — Mercury',
    shortTitle: '4 · Mercury',
    model: 'Newtonian residual',
    status: 'available',
    summary:
      'Mercury’s closest point to the Sun (perihelion) slowly advances. Most of that advance is explained by other planets under Newton — but about 43 arcseconds per century remain. That residual is not “Mercury retrograde”; it is a crack that General Relativity later seals.',
    whatWeShow: [
      'Closed Kepler ellipse (Newton / pure inverse-square)',
      'Same orbit with residual perihelion precession (exaggerated rosette)',
      'Side-by-side compare + perihelion markers',
      'Real rates: ~532″/cy planets + ~43″/cy residual ≈ total observed',
      'History: Le Verrier, Vulcan hypothesis, Einstein’s later fix',
    ],
    equations: [
      'Δω_residual ≈ 42.98″ / century',
      'Δω_Newton(planets) ≈ 532″ / century',
      'r = a(1−e²)/(1+e cos ν)  (ellipse)',
    ],
    verified:
      'The anomalous perihelion advance is a real, measured residual after Newtonian perturbations. GR predicts it without inventing a new planet.',
    honestyNote:
      'The animation multiplies the residual rate by a large teaching factor so the rosette appears in minutes, not centuries. Readout numbers are the real astronomical values. Orbit is planar 2-body Kepler + prescribed ω̇ — not a full N-body + GR integrator.',
    demoIds: ['D7'],
    howToExplore: [
      'Start on Compare: blue = fixed perihelion, orange = residual advance.',
      'Speed up time; watch the orange perihelion marker crawl and the purple trail form a rosette.',
      'Switch Newton-only to see a closed orbit that never “opens.”',
      'Open History for Le Verrier / Vulcan / GR teaser — then continue to SR and GR chapters.',
    ],
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
