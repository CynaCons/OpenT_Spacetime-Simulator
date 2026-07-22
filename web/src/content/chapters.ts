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
      'Ship on the curved surface: hull-first drop / transparent when occluded',
      'Everest: mutual-visibility range rings',
      'Field-of-view wedge + horizon tangent ray',
    ],
    equations: [
      'd_horizon ≈ √(2 R h + h²)',
      'd_visible ≈ √(2 R h₁) + √(2 R h₂)',
      'cos(dip) = R / (R + h)',
    ],
    verified:
      'Observer geometry: horizon distance and dip grow with height only if the surface curves away.',
    honestyNote:
      'Earth is an oblate spheroid. Atmosphere and refraction extend real horizons slightly. Teaching arc stretches surface distances for visibility.',
    demoIds: ['D0', 'D1', 'D2'],
    howToExplore: [
      'Rocket: Launch or scrub altitude on Sphere, then flip to Flat.',
      'Ship / horizon: Sail away — hull fades, then full ghost when occluded.',
      'Toggle Field of view; compare gold vs green range rings (Everest).',
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
      'The solar system under Newton’s inverse-square law and Kepler’s laws — an extraordinarily successful model for centuries.',
    whatWeShow: [
      'Sun and planets on orbital paths',
      'Velocity (green) and force (red) vectors',
      'Period labels and Kepler T²/a³ check',
      'Planet tour with focus',
    ],
    equations: ['F = G m₁ m₂ / r²', 'a = GM / r²', 'T² ∝ a³ (Kepler III)'],
    verified: 'Planetary motions to high accuracy for most purposes.',
    honestyNote: 'Orbits here are circular Keplerian (visual). Eccentricity and N-body effects deferred.',
    demoIds: ['D4', 'D5'],
    howToExplore: [
      'Toggle Velocity / Force vectors.',
      'Tour planets — check T²/a³ ≈ 1.',
      'Speed up time; double-click a planet to center.',
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
      'Hands-on inverse-square intuition: place masses, launch test particles, watch trails, and compare speed to escape velocity.',
    whatWeShow: [
      'Central mass + orbiting test body',
      'Place masses / particles',
      'Trails, force vectors, adjustable G',
      'Escape-speed comparison',
    ],
    equations: ['a = GM / r²', 'v_esc = √(2GM / r)', 'F = G m₁ m₂ / r²'],
    verified: 'Pedagogical verification of inverse-square behavior (toy parameters).',
    honestyNote: 'Softened gravity + semi-implicit Euler — intuition, not homework precision.',
    demoIds: ['D6'],
    howToExplore: [
      'Toggle Force and Trails; speed until |v| > v_esc.',
      'Place a test particle; vary G.',
      'Continue to Mercury — Newton is almost perfect… but not quite.',
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
      'Mercury’s perihelion advances ~43″/century more than Newton predicts after planetary perturbations. Not apparent retrograde — a crack sealed by GR.',
    whatWeShow: [
      'Closed Kepler ellipse vs residual precession',
      'Rosette trail + perihelion markers',
      'Real rates: ~532″/cy + ~43″/cy residual',
      'History: Le Verrier, Vulcan, Einstein',
    ],
    equations: [
      'Δω_residual ≈ 42.98″ / century',
      'Δω_Newton(planets) ≈ 532″ / century',
      'r = a(1−e²)/(1+e cos ν)',
    ],
    verified: 'Anomalous perihelion advance is measured; GR predicts it without a new planet.',
    honestyNote: 'Animation multiplies residual rate for visibility; readouts are real values.',
    demoIds: ['D7'],
    howToExplore: [
      'Compare: blue fixed perihelion, orange residual.',
      'Speed up; watch the rosette form.',
      'Read History, then continue to SR → GR → proofs.',
    ],
  },
  {
    id: 'special-relativity',
    index: 5,
    title: 'Special Relativity',
    shortTitle: '5 · SR',
    model: 'Special Relativity',
    status: 'available',
    summary:
      'When relative speeds are a non-negligible fraction of c, moving clocks tick slower and lengths contract. Essential for GPS and as a prelude to GR.',
    whatWeShow: [
      'Light clock at rest vs moving (time dilation)',
      'Lorentz factor γ readout',
      'Length contraction of a moving rod',
      'GPS preview: SR clock correction ~−7 µs/day',
    ],
    equations: ['γ = 1 / √(1 − v²/c²)', 'Δt_lab = γ Δτ', 'L = L₀ / γ'],
    verified: 'Particle lifetimes, atomic clocks, colliders, operational GNSS models.',
    honestyNote: 'Demos are in the lab frame with ideal mirrors/rods — pedagogical, not full 4-vector machinery.',
    demoIds: ['D8', 'D9'],
    howToExplore: [
      'Raise β and watch the moving light clock lag.',
      'Switch to Length contraction.',
      'Note GPS teaser; full clock story is Chapter 7.',
    ],
  },
  {
    id: 'general-relativity',
    index: 6,
    title: 'General Relativity & geodesics',
    shortTitle: '6 · GR',
    model: 'General Relativity (weak-field pedagogy)',
    status: 'available',
    summary:
      'Gravity as spacetime curvature. Free-fall paths are geodesics. Newton’s force picture remains an excellent weak-field approximation.',
    whatWeShow: [
      'Warped “fabric” grid (metaphor + caveats)',
      'Planetary geodesic paths',
      'Force vs geodesic picture toggle',
      'Photon path near mass; Mercury precession hint',
    ],
    equations: [
      'Geodesic: free-fall = straightest path',
      'Weak field ≈ Newton + small corrections',
      'Light deflection δ = 4GM/(c²b) (preview)',
    ],
    verified: 'Solar-system tests, light deflection, clock rates in gravity wells.',
    honestyNote: 'Rubber-sheet embedding is a teaching metaphor — not literal 4D spacetime.',
    demoIds: ['D10', 'D11'],
    howToExplore: [
      'Raise central mass; watch the grid deepen.',
      'Toggle Geodesic / Force / Both.',
      'Focus Mercury; turn on Photon path; continue to proofs.',
    ],
  },
  {
    id: 'proofs-of-gr',
    index: 7,
    title: 'Proofs that GR works',
    shortTitle: '7 · Proofs',
    model: 'Experimental confirmation',
    status: 'available',
    summary:
      'Landmark confirmations: 1919 solar-eclipse light deflection (Eddington) and the everyday necessity of SR+GR corrections for GPS.',
    whatWeShow: [
      'Eclipse starlight deflection: none / Newton / GR',
      'GPS: SR and GR clock rates; map error if uncorrected',
      'Both corrections required',
      'Proof gallery notes for further experiments',
    ],
    equations: [
      'δ = 4GM/(c²b) ≈ 1.75″ (solar limb)',
      'GPS: ≈ −7 µs/d (SR) + 45 µs/d (GR) ≈ +38 µs/d net',
    ],
    verified:
      'GR light deflection (eclipse and modern radio); GNSS systems require relativistic clock models.',
    honestyNote: 'Figures are standard teaching magnitudes; not a full GNSS or ray-tracing engine.',
    demoIds: ['D12', 'D13'],
    howToExplore: [
      'Eclipse: switch deflection model — only GR matches 1.75″.',
      'GPS: leave corrections off and watch km-scale drift; enable both SR and GR.',
      'You’ve completed the core story arc — explore earlier chapters freely.',
    ],
  },
]

export function getChapter(id: string): Chapter | undefined {
  return CHAPTERS.find((c) => c.id === id)
}
