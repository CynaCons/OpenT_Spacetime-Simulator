# PLAN.md — OpenT Spacetime Simulator

**Living plan.** Update this file as tasks and subtasks complete.  
**Last updated:** 2026-07-21  
**Current phase:** Phase 1 — App shell + solar system foundation (in progress)  

---

## Status Legend

| Symbol | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[~]` | In progress |
| `[x]` | Done |
| `[-]` | Cancelled / deferred |

---

## Overall Roadmap

```
Phase 0  Project init (docs, repo, tooling)           [x] mostly complete
Phase 1  App shell + 3D solar system foundation       [~]
Phase 2  Chapter 1 — Earth is not flat                [ ]
Phase 3  Chapters 2–3 — Newton + gravity sandbox      [ ]
Phase 4  Chapter 4 — Mercury / limits of Newton       [ ]
Phase 5  Chapter 5 — Special Relativity               [ ]
Phase 6  Chapter 6 — GR geodesics                     [ ]
Phase 7  Chapter 7 — Proofs (eclipse, GPS)            [ ]
Phase 8  Polish, content, deploy                      [ ]
```

Each phase below is a **sub-iteration** with deliverables, acceptance criteria, and ordered tasks.

---

## Phase 0 — Project initiation

**Goal:** Establish product definition, plan, and runnable scaffold.  
**Status:** `[x]` Done (git remote optional)

### Deliverables
- [x] `PRD.md` — product requirements and narrative arc  
- [x] `PLAN.md` — this plan with all phase iterations  
- [x] Git repository initialized  
- [x] README skeleton  
- [x] License (MIT)  
- [x] Vite + React + TypeScript + R3F scaffold (`web/`)  
- [x] Smoke: `npm run dev` launches without critical errors  

### Tasks
- [x] Write PRD with chapters, requirements, tech direction  
- [x] Write PLAN with sub-iterations for all demos  
- [x] Init git + initial commit after scaffold  
- [x] Scaffold frontend app  
- [x] Smoke test (build + browser: title, chapters, planets; only non-critical THREE.Clock deprecation warn)

### Acceptance
- [x] Contributor can read PRD + PLAN and know what to build next  
- [x] App skeleton runs in browser  

---

## Phase 1 — App shell + 3D solar system foundation

**Goal:** Navigable 3D solar system and app chrome that all chapters plug into.  
**Status:** `[~]` In progress  
**Depends on:** Phase 0  

### Demo / feature focus
- Solar system scene (Sun + 8 planets; Moon optional here)  
- Free camera, time controls, chapter selector shell  
- Side panel layout for explanations  

### Sub-iterations

#### 1.1 — Tooling & project skeleton
- [x] Vite + React + TS  
- [x] Three.js, @react-three/fiber, @react-three/drei  
- [ ] ESLint/Prettier optional  
- [x] Folder structure:
  ```
  web/src/
    app/           # shell, layout
    scenes/        # 3D scenes per chapter
    physics/       # Newton, SR helpers, GR approximations
    content/       # chapter copy, equations, citations
    components/    # UI + 3D shared
    state/         # time, camera, active chapter
  ```

#### 1.2 — App chrome
- [x] Layout: top bar (title, chapter), left panel, main canvas  
- [x] Chapter list navigation (jump + next/prev)  
- [x] Time controls: pause / play / speed  
- [x] Reset chapter button  

#### 1.3 — Solar system scene (visual + kinematics)
- [x] Sun + Mercury…Neptune as spheres (visual scale)  
- [x] Orbital paths (circular scaffold; eccentricity later)  
- [x] Labels on bodies  
- [ ] Focus camera on body (select works; camera focus pending)  
- [x] Day scaling via speed controls  
- [ ] Moon for Earth demos  
- [ ] True / log / visual scale modes  

#### 1.4 — Content system
- [x] Chapter content schema (id, title, body fields, equations, demoIds)  
- [x] Placeholder content for all 7 chapters  

#### 1.5 — Smoke & quality
- [x] Dev server starts clean  
- [x] No critical console errors  
- [x] Basic README run instructions  
- [ ] Unit tests for orbital helpers  

### Acceptance criteria
- [x] User can fly around a labeled solar system  
- [x] User can switch chapter placeholders without crash  
- [x] Time can be paused and accelerated  

### Notes
- Prefer **visual scale mode** default (true scale makes planets invisible).  
- Document scale modes in UI.  

### Remaining for Phase 1 complete
- [ ] Camera focus-on-selection  
- [ ] Optional Moon  
- [ ] Scale mode toggle + UI note  
- [ ] Optional ESLint  

---

## Phase 2 — Chapter 1: Earth is not flat

**Goal:** Interactive geometric evidence that Earth is a sphere (oblate spheroid noted).  
**Status:** `[ ]` Pending  
**Depends on:** Phase 1  

### Sub-iterations

#### 2.1 — Globe Earth scene
- [ ] Textured Earth sphere (or stylized continents)  
- [ ] Axial tilt, day/night terminator  
- [ ] Latitude/longitude grid toggle  
- [ ] Camera presets: space view, surface horizon, polar  

#### 2.2 — Flat model comparison
- [ ] Flat-disk representation  
- [ ] Same “observations” attempted on both models  
- [ ] UI contrast: what works on sphere fails on disk  

#### 2.3 — Horizon / ship demo
- [ ] Object receding over curved horizon (hull-first)  
- [ ] Distance slider + observer height  

#### 2.4 — Latitude / Sun elevation demo
- [ ] Sun angle at different latitudes same date  
- [ ] Optional Eratosthenes stick-shadow interactive  

#### 2.5 — Chapter content
- [ ] Equations/geometry notes (circumference, angular size)  
- [ ] Honesty note: Earth is oblate spheroid  
- [ ] Sources  

### Acceptance criteria
- User can toggle sphere vs flat and see qualitative failures of flat model  
- Horizon demo clearly shows curvature effect  
- Side panel explains *what is verified* by geometry and observation  

---

## Phase 3 — Chapters 2–3: Newtonian gravity + sandbox

**Goal:** Show Newtonian model of the solar system and build intuition for inverse-square gravity.  
**Status:** `[ ]` Pending  
**Depends on:** Phase 1 (can parallelize content with Phase 2)  

### Sub-iterations

#### 3.1 — Newtonian orbit engine
- [ ] Integrate semi-major axes, periods (Keplerian first)  
- [ ] Optional: simple symplectic N-body for Sun-dominated system  
- [ ] Toggle force vectors / velocity vectors  
- [ ] Display \( F = G m_1 m_2 / r^2 \) and Kepler \( T^2 \propto a^3 \)  

#### 3.2 — Solar system under Newton (Chapter 2)
- [ ] Guided tour: focus each planet, period, distance  
- [ ] Compare circular vs eccentric orbit visualization  
- [ ] “What Newton assumes” panel (absolute time, inverse square, etc.)  

#### 3.3 — Gravity pull sandbox (Chapter 3)
- [ ] Empty space + place masses  
- [ ] Drag to set velocity; trail paths  
- [ ] Adjust G or masses for pedagogy (flag “toy mode”)  
- [ ] Escape velocity experiment  
- [ ] Two-body orbit creation challenge  

#### 3.4 — Content & equations
- [ ] Clear derivation-level explanation of inverse square (qualitative + formula)  
- [ ] Link forward: “this works almost perfectly… until Mercury”  

### Acceptance criteria
- Solar system runs under Newtonian/Keplerian model with readable equations  
- Sandbox lets user create stable-ish orbits and feel \(1/r^2\)  
- No critical errors under high time acceleration (clamp if needed)  

---

## Phase 4 — Chapter 4: Limits of Newton (Mercury perihelion)

**Goal:** Show the historical crack in Newton: Mercury’s anomalous perihelion precession.  
**Status:** `[ ]` Pending  
**Depends on:** Phase 3  

### Content accuracy
Use **perihelion precession**, not “Mercury retrograde,” as the GR-relevant anomaly.  
(Optional separate micro-demo for *apparent* retrograde later.)

### Sub-iterations

#### 4.1 — Precession visualization
- [ ] Mercury orbit with exaggerated precession for visibility  
- [ ] True residual scale noted in UI (~43″/century)  
- [ ] Rosette / rotating periapsis marker  

#### 4.2 — Newton vs observation
- [ ] Split view or overlay: Newtonian residual vs observed  
- [ ] Timeline: Le Verrier, hypothesized planet Vulcan, open problem  

#### 4.3 — Bridge to Einstein
- [ ] Teaser panel: GR accounts for the residual without Vulcan  
- [ ] Link to Chapter 6–7 for full explanation  

#### 4.4 — Content
- [ ] Equations for perihelion advance (display form)  
- [ ] Sources (historical + modern value)  

### Acceptance criteria
- User can *see* precession of perihelion  
- User understands Newton is extremely good but not exact for Mercury  
- Clear distinction from apparent retrograde motion  

---

## Phase 5 — Chapter 5: Special Relativity

**Goal:** Build SR intuition needed for GPS and as prelude to GR.  
**Status:** `[ ]` Pending  
**Depends on:** Phase 1  

### Sub-iterations

#### 5.1 — Light clock demo
- [ ] Vertical light clock at rest vs moving  
- [ ] Time dilation readout \( \gamma \)  
- [ ] Speed slider (fraction of c)  

#### 5.2 — Supporting SR visuals
- [ ] Length contraction of a moving rod/ship  
- [ ] Simple simultaneity demo (two lightning strikes / train)  

#### 5.3 — Content
- [ ] Postulates of SR  
- [ ] Key equations on panel  
- [ ] Preview: satellite clocks move fast → SR correction  

### Acceptance criteria
- Light clock makes time dilation visually obvious  
- Equations match the animation  
- User can restate why moving clocks run slow (in SR sense)  

---

## Phase 6 — Chapter 6: General Relativity & geodesics

**Goal:** Show spacetime curvature and geodesics of solar-system bodies.  
**Status:** `[ ]` Pending  
**Depends on:** Phases 3–5  

### Sub-iterations

#### 6.1 — Spacetime visualization
- [ ] 3D/2.5D grid warped by central mass (Sun)  
- [ ] Caveat UI: embedding is a metaphor; real spacetime is 4D  
- [ ] Mass slider warps grid  

#### 6.2 — Geodesics
- [ ] Free-fall paths as geodesics (planets as “straight” in curved spacetime)  
- [ ] Compare Newton force picture vs GR geodesic picture (toggle)  
- [ ] Optional photon paths near Sun (bridge to eclipse)  

#### 6.3 — Solar system geodesic tour
- [ ] Explore orbits with free camera  
- [ ] Highlight geodesic segment for selected body  
- [ ] Mercury: show GR correction path vs Newton  

#### 6.4 — Content
- [ ] Equivalence principle intro  
- [ ] Schematic geodesic equation  
- [ ] What GR keeps from Newton at weak field  

### Acceptance criteria
- User can orbit the warped grid and selected geodesics in 3D  
- Toggle makes Newton vs GR conceptual difference clear  
- Mercury residual tied back to Ch. 4  

---

## Phase 7 — Chapter 7: Proofs of GR

**Goal:** “Show” landmark confirmations in the simulator.  
**Status:** `[ ]` Pending  
**Depends on:** Phase 6  

### Sub-iterations

#### 7.1 — 1919 solar eclipse (Eddington)
- [ ] Scene: Sun, Moon covering disk, star field  
- [ ] Rays deflected near solar limb  
- [ ] Compare: no deflection / Newtonian / GR prediction  
- [ ] Historical context panel (Sobral & Príncipe expeditions)  

#### 7.2 — GPS / GNSS relativity
- [ ] Earth + constellation of satellites (simplified)  
- [ ] Clock rate panel: SR (velocity) vs GR (gravity well)  
- [ ] Map error accumulation if uncorrected (visual drift)  
- [ ] Show that *both* corrections are required  

#### 7.3 — Proof gallery shell
- [ ] UI list of proofs with status: Interactive / Coming soon  
- [ ] Placeholders for redshift, lensing, pulsars  

#### 7.4 — Content & citations
- [ ] Deflection angle formula \( \delta = 4GM / (c^2 b) \)  
- [ ] GPS microsecond/day figures with sources  
- [ ] “What was verified” checklist  

### Acceptance criteria
- Eclipse demo shows GR deflection as the matching model  
- GPS demo shows large positioning error without corrections  
- User can name at least two independent confirmations of GR  

---

## Phase 8 — Polish, pedagogy, deploy

**Goal:** Ship a coherent public v1.  
**Status:** `[ ]` Pending  
**Depends on:** Phases 1–7  

### Sub-iterations

#### 8.1 — Content pass
- [ ] Unified tone, glossary  
- [ ] All equations reviewed  
- [ ] All “approximation honesty” notes present  

#### 8.2 — UX / a11y
- [ ] Keyboard navigation for chapter UI  
- [ ] Contrast, focus rings  
- [ ] Reduced-motion option for intensive animations  

#### 8.3 — Performance
- [ ] LOD / poly budgets  
- [ ] Profile solar system + geodesic scenes  

#### 8.4 — Deploy
- [ ] Static build  
- [ ] GitHub Pages or Cloudflare Pages  
- [ ] README badges + screenshots  

#### 8.5 — Optional v1.1 backlog triage
- [ ] Rank Appendix demos from PRD  
- [ ] Create GitHub issues for top 3 extensions  

### Acceptance criteria
- Full story arc playable without crashes  
- README enables one-command local run  
- Deployed URL works  

---

## Cross-cutting workstreams

These run alongside phases as needed.

| Workstream | Notes | Status |
|------------|-------|--------|
| **Physics modules** | `physics/newton`, `physics/sr`, `physics/grApprox` | `[~]` data scaffold only |
| **Content / MD** | Chapter copy + citations | `[~]` placeholders for 7 chapters |
| **Camera & annotation system** | Shared highlight, arrows, callouts | `[ ]` |
| **Testing** | Unit tests for orbital math; smoke for app | `[ ]` |
| **Design system** | Dark science UI, readable type | `[~]` base CSS in place |

---

## Demo inventory tracker

| # | Demo | Chapter | Phase | Status |
|---|------|---------|-------|--------|
| D1 | Globe vs flat Earth | 1 | 2 | `[ ]` |
| D2 | Horizon / ship curvature | 1 | 2 | `[ ]` |
| D3 | Latitude / Sun / Eratosthenes | 1 | 2 | `[ ]` |
| D4 | Newtonian solar system tour | 2 | 3 | `[~]` base solar system live |
| D5 | Force/velocity vectors | 2–3 | 3 | `[ ]` |
| D6 | Gravity pull sandbox | 3 | 3 | `[ ]` |
| D7 | Mercury perihelion anomaly | 4 | 4 | `[ ]` |
| D8 | Light clock (SR) | 5 | 5 | `[ ]` |
| D9 | Length contraction / simultaneity | 5 | 5 | `[ ]` |
| D10 | Spacetime grid warp | 6 | 6 | `[ ]` |
| D11 | Solar system geodesics | 6 | 6 | `[ ]` |
| D12 | 1919 eclipse light deflection | 7 | 7 | `[ ]` |
| D13 | GPS relativity corrections | 7 | 7 | `[ ]` |
| D14 | Apparent retrograde (optional) | bonus | backlog | `[ ]` |
| D15 | Gravitational redshift | bonus | backlog | `[ ]` |
| D16 | Lensing / pulsars / GP-B | bonus | backlog | `[ ]` |

---

## Suggested number of demos (discussion default)

| Tier | Count | Includes |
|------|-------|----------|
| **v1 core** | **9 interactive demos** | D1–D2, D4, D6–D8, D10–D13 (D3, D5, D9 as polish within chapters) |
| **v1 complete** | **13** | All D1–D13 |
| **v1.1+** | +3–5 | D14–D16 and expansions |

**Recommendation:** Ship **v1 complete (D1–D13)** as the story arc; treat D14+ as post-v1 so the narrative stays tight.

---

## Immediate next actions

1. [~] Finish Phase 1 polish (camera focus, scale modes) — optional before Ch.1  
2. [ ] Phase 2: Earth is not flat demos  
3. [ ] Phase 3: Newton + gravity sandbox  
4. Continue story order Phases 4 → 7  

---

## Progress log

| Date | Update |
|------|--------|
| 2026-07-21 | Project initiated. PRD.md + PLAN.md created. Scaffolded `web/` (Vite/React/TS/R3F). App shell + circular Kepler solar system + 7 chapter placeholders. Build OK; browser smoke OK (no critical console errors). Phase 0 complete; Phase 1 largely done. |

---

*Update this file whenever a task/subtask status changes.*
