# PLAN.md — OpenT Spacetime Simulator

**Living plan.** Update this file as tasks and subtasks complete.  
**Last updated:** 2026-07-21  
**Current phase:** Phase 3 — Newton + gravity sandbox (v1)  

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
Phase 0  Project init (docs, repo, tooling)           [x]
Phase 1  App shell + 3D solar system foundation       [x] (scale modes / Moon optional later)
Phase 2  Chapter 1 — Earth is not flat                [x] v1 mature
Phase 3  Chapters 2–3 — Newton + gravity sandbox      [x] v1
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
- [x] Focus camera on body (Sun / Earth / Selected / Free + double-click)  
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

### Remaining optional (not blocking Phase 2)
- [ ] Optional Moon  
- [ ] Scale mode toggle + UI note  
- [ ] Optional ESLint  
- [x] Camera focus-on-selection / free re-center  
- [x] GitHub repo + Pages deploy workflow  

**Phase 1 status:** `[x]` Complete enough to ship demos  

---

## Phase 2 — Chapter 1: Earth is not flat

**Goal:** Interactive geometric evidence that Earth is a sphere (oblate spheroid noted).  
**Status:** `[x]` **v1 mature** (2026-07-21)  
**Depends on:** Phase 1  

### Design thesis (rocket altitude / curvature)

If Earth were a flat disk, climbing higher in a small rocket would just show a larger flat plane.  
On a **sphere**, as altitude increases:

1. The **horizon drops** below eye level (geometric dip of the horizon).  
2. A larger fraction of the surface becomes visible, and the **limb becomes curved**.  
3. Eventually you see a **whole-disk Earth** — not what a flat plane with the same local “up” predicts.

**Integration in the simulator:**

Chapter 1 switches the viewport to a dedicated **Earth lab** (`EarthLabScene`), not the full solar system. Rocket + ship sub-demos share sphere/flat model toggle.

| Mode | What the user does | What they see |
|------|--------------------|---------------|
| **Sphere Earth** | Launch / altitude slider 0 → 2000 km | Limb curves; horizon guide dips; globe fills view |
| **Flat disk** | Same altitude path | Plane stays flat; gold rim is disk edge only |
| **A-B toggle** | Flip model mid-flight | Instant comparison with identical rocket path |

### Sub-iterations

#### 2.0 — Chapter scene switcher (platform)
- [x] When chapter = `earth-not-flat`, load `EarthLabScene` instead of full solar system  
- [x] Sub-demo tabs: Rocket ascent · Ship/horizon  
- [x] HUD + chapter panel + top-bar shortcuts  
- [x] Free orbit look mode on rocket demo  

#### 2.1 — Globe Earth scene
- [x] Procedural textured Earth sphere (stylized continents)  
- [ ] Axial tilt / day-night terminator (polish backlog)  
- [x] Wireframe grid toggle  
- [x] Look presets: horizon ride, nadir, orbit free  

#### 2.2 — **Rocket ascent / curvature demo (hero)**
- [x] Launch site + simple rocket mesh  
- [x] Altitude scrubber + Launch animation  
- [x] Camera rides with rocket (horizon / down / orbit)  
- [x] Readouts: altitude, horizon distance, horizon dip  
- [x] Gold horizon guide ring  
- [x] Equations in side panel: √(2Rh+h²), dip  

#### 2.3 — Flat model comparison
- [x] Flat-disk with same procedural map texture  
- [x] Same rocket altitude path on flat model  
- [x] Toggle sphere vs flat  
- [x] HUD callouts for model mismatch  

#### 2.4 — Horizon / ship demo (supporting)
- [x] Ship recedes; beyond horizon on sphere  
- [x] Distance slider + sail animation  
- [x] Flat model: ship stays visible (shrinks only)  

#### 2.5 — Latitude / Sun elevation (optional — backlog)
- [ ] Sun angle at different latitudes same date  
- [ ] Optional Eratosthenes stick-shadow interactive  

#### 2.6 — Chapter content
- [x] Equations / geometry notes  
- [x] Honesty note: oblate spheroid; refraction; teaching scale  
- [ ] Sources / further reading links (nice-to-have)  
- [x] “What was verified” + how-to-explore steps  
- [x] Chapter status → `available`  

### Acceptance criteria
- [x] User can launch/scrub rocket and see curvature cues on sphere  
- [x] Same flight on flat model shows qualitative mismatch  
- [x] Side panel explains model, geometry, verification  
- [x] Build passes; browser smoke for Ch.1  

### Out of scope for Phase 2 v1
- Full orbital mechanics of the rocket  
- Debunking every flat-Earth claim  
- Photoreal ISS footage  
- Eratosthenes (deferred 2.5)  

### Code map (Chapter 1)
```
web/src/
  physics/earthGeometry.ts
  state/earthLabStore.ts
  scenes/earth/
    EarthLabScene.tsx
    RocketAscentDemo.tsx
    ShipHorizonDemo.tsx
    EarthMeshes.tsx
    createEarthTexture.ts
  components/EarthLabHud.tsx
```  

---

## Phase 3 — Chapters 2–3: Newtonian gravity + sandbox

**Goal:** Show Newtonian model of the solar system and build intuition for inverse-square gravity.  
**Status:** `[x]` **v1** (2026-07-21)  
**Depends on:** Phase 1  

### Sub-iterations

#### 3.1 — Newtonian orbit engine
- [x] Keplerian circular solar system (existing) + μ helpers  
- [ ] Optional: full symplectic N-body (later)  
- [x] Toggle force vectors / velocity vectors  
- [x] Display \( F = G m_1 m_2 / r^2 \) and Kepler \( T^2 \propto a^3 \)  

#### 3.2 — Solar system under Newton (Chapter 2)
- [x] Guided tour: focus each planet, period, distance  
- [ ] Eccentric orbits toggle (backlog)  
- [x] Newton HUD + chapter content  

#### 3.3 — Gravity pull sandbox (Chapter 3)
- [x] Central mass + orbiting body  
- [x] Place masses / test particles  
- [x] Trails, adjustable G, force vectors  
- [x] Escape velocity readout + nudge  
- [ ] Drag-to-aim velocity gizmo (polish)  

#### 3.4 — Content & equations
- [x] Inverse-square + Kepler copy  
- [x] Link forward to Mercury chapter  

### Acceptance criteria
- [x] Solar system Newtonian tour with vectors + Kepler check  
- [x] Sandbox place/trails/escape  
- [x] Build OK  

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
| D0 | Rocket ascent / altitude curvature (hero) | 1 | 2 | `[x]` v1 |
| D1 | Globe vs flat Earth | 1 | 2 | `[x]` v1 (toggle) |
| D2 | Horizon / ship curvature | 1 | 2 | `[x]` v1 |
| D3 | Latitude / Sun / Eratosthenes | 1 | 2 | `[ ]` |
| D4 | Newtonian solar system tour | 2 | 3 | `[x]` v1 |
| D5 | Force/velocity vectors | 2–3 | 3 | `[x]` v1 |
| D6 | Gravity pull sandbox | 3 | 3 | `[x]` v1 |
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

1. [x] Camera zoom/orbit center controls  
2. [x] GitHub repo + Pages  
3. [x] **Phase 2 v1 mature:** Earth lab + rocket + flat compare + ship  
4. [x] Ship occluded → transparent (not removed)  
5. [x] **Phase 3 v1:** Newton tour + gravity sandbox  
6. [ ] **Phase 4:** Mercury perihelion anomaly  

---

## Progress log

| Date | Update |
|------|--------|
| 2026-07-21 | Project initiated. PRD.md + PLAN.md created. Scaffolded `web/` (Vite/React/TS/R3F). App shell + circular Kepler solar system + 7 chapter placeholders. Build OK; browser smoke OK (no critical console errors). Phase 0 complete; Phase 1 largely done. |
| 2026-07-21 | Camera center controls (Sun/Earth/Selected/Free, double-click focus, RMB pan). GitHub Pages workflow + README. Phase 2 plan expanded with rocket-altitude curvature demo as Chapter 1 hero. |
| 2026-07-21 | **Chapter 1 v1 mature:** EarthLabScene, rocket ascent (sphere/flat, teaching scale, horizon guide, dip/distance readouts), ship/horizon demo, full panel content, status `available`. Build + browser smoke OK. |
| 2026-07-21 | Earth lab camera: always-on OrbitControls; Horizon/Down are snap presets; drag frees camera; orbit target follows rocket. |
| 2026-07-21 | Ship lab overhaul: teaching arc so ships follow curvature; hull/mid/mast drop; Everest + mutual visibility rings; FOV wedge & horizon tangent. |
| 2026-07-21 | Ship occluded → transparent ghost. Phase 3 v1: Newton vectors/tour + gravity sandbox (place, trails, G, escape). |

---

*Update this file whenever a task/subtask status changes.*
