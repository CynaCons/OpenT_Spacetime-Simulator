# Product Requirements Document (PRD)
# OpenT Spacetime Simulator

**Version:** 0.1.0  
**Status:** Draft — Project initiation  
**Last updated:** 2026-07-21  
**Codename:** OpenT Spacetime Simulator  

---

## 1. Vision

OpenT Spacetime Simulator is an interactive **3D educational simulator** that walks users through the scientific story of gravity, motion, and spacetime—from everyday evidence that Earth is a sphere, through Newtonian gravity, to Special and General Relativity, and the experiments that confirmed them.

The product is designed for **curious learners and educators**: people who want to *see* why models work, where they fail, and how better models replaced them—not just read equations.

**Tagline:** *See gravity. See spacetime. See the proofs.*

---

## 2. Problem Statement

Popular science explanations of gravity and relativity are often:

- Text- or 2D-diagram heavy, hard to internalize in three dimensions  
- Fragmented across blogs, videos, and textbooks with no continuous narrative  
- Weak on *why* older models were trusted, *how* they failed, and *what* experiments settled the debate  

There is no single, free, open, interactive 3D experience that:

1. Simulates the solar system under successive physical models  
2. Highlights geometric evidence against a flat Earth  
3. Shows Newtonian gravity as an excellent approximation  
4. Shows where Newton fails (Mercury perihelion precession)  
5. Introduces Special then General Relativity with visual geodesics  
6. Replays the landmark proofs (1919 eclipse, GPS relativity corrections, etc.)

---

## 3. Goals

### 3.1 Primary goals

| ID | Goal |
|----|------|
| G1 | Provide a navigable **3D solar system** under configurable physics models |
| G2 | Make **“Earth is not flat”** intuitive via interactive geometry demos |
| G3 | Teach **Newtonian gravity** with equations, orbits, and a gravity-pull sandbox |
| G4 | Show **limits of Newton** via Mercury’s anomalous perihelion precession |
| G5 | Introduce **Special Relativity** (time dilation, light clocks, simultaneity) |
| G6 | Introduce **General Relativity** (curved spacetime, geodesics of solar-system bodies) |
| G7 | **Show historical / practical proofs** of GR (eclipse light deflection, GPS clocks) |
| G8 | Present **models, equations, and verification** side-by-side with the 3D view |

### 3.2 Secondary goals

| ID | Goal |
|----|------|
| G9 | Fully keyboard + mouse (and later touch) exploration of scenes |
| G10 | Modular “demo chapters” that can be extended without rewriting the core |
| G11 | Open-source, reproducible science content with cited sources |
| G12 | Performance suitable for mid-range laptops in the browser |

### 3.3 Non-goals (v1)

- Full N-body astrophysics accuracy for mission planning  
- Quantum gravity, string theory, or cosmology beyond solar-system scale  
- Multiplayer / social features  
- Mobile-first UI (responsive is nice-to-have; desktop is primary)  
- Photorealistic rendering competing with AAA space games  

---

## 4. Target Users

| Persona | Needs |
|---------|--------|
| **Curious adult** | Clear story, “aha” visuals, not overloaded with jargon |
| **Educator / science communicator** | Chapter-based demos, pause/reset, on-screen equations |
| **STEM student** | Equations, parameters, model comparison, references |
| **Skeptic of flat-Earth claims** | Geometric and observational demos that are hard to dismiss |

Tone: respectful, evidence-first, never condescending. No personal framing in the product UI or copy.

---

## 5. Product Narrative (Core Story Arc)

The product is structured as a **guided journey** through scientific models. Each chapter is a self-contained 3D demo with narration panel, equations, and free exploration.

```
[1] Earth is a sphere
        ↓
[2] Newtonian gravity & solar system
        ↓
[3] Gravity sandbox (inverse-square intuition)
        ↓
[4] Where Newton fails — Mercury perihelion
        ↓
[5] Special Relativity
        ↓
[6] General Relativity & geodesics
        ↓
[7] Proofs of GR (eclipse, GPS, more)
        ↓
[8+] Optional extensions
```

### 5.1 Chapter summaries

#### Chapter 1 — Earth is not flat
- Globe Earth with day/night terminator, polar circles, equinox/solstice  
- Horizon: ships/objects disappearing hull-first  
- Different star visibility / Sun elevation by latitude  
- Optional: Eratosthenes-style shadow measurement thought experiment  
- Contrasts with a flat-disk model (same “data” fails on the flat model)

#### Chapter 2 — Newtonian solar system
- Sun + planets with Keplerian / Newtonian orbits  
- Labels for period, semi-major axis, eccentricity  
- On-screen: \( F = G \frac{m_1 m_2}{r^2} \), Kepler’s laws  
- Time acceleration, pause, focus on any body  
- Optional: inverse-square force vectors and acceleration arrows

#### Chapter 3 — Gravity pull sandbox
- Free particles / test masses under Newtonian gravity  
- Adjustable mass, distance; feel \( 1/r^2 \)  
- Two-body and simple multi-body scenarios  
- Escape velocity demos

#### Chapter 4 — Limits of Newton: Mercury
- **Note for content accuracy:** the key anomaly is the **perihelion precession** of Mercury (~43 arcseconds/century unexplained by Newton), not “Mercury retrograde” (which is an optical apparent motion).  
- Side-by-side: Newtonian prediction vs observed precession  
- Highlight residual that GR later explains  
- Brief historical note (Le Verrier, Vulcan hypothesis)

#### Chapter 5 — Special Relativity
- Light clock thought experiment (time dilation)  
- Length contraction visualization  
- Relativity of simultaneity (simple train/platform style scene)  
- Bridge to technology: why satellite clocks need SR corrections (preview of Ch. 7)

#### Chapter 6 — General Relativity & geodesics
- Spacetime as a fabric / grid warped by mass (careful about rubber-sheet caveats)  
- Geodesics: free-fall paths as “straightest” lines in curved spacetime  
- Solar system bodies following GR geodesics (comparison overlay vs Newton)  
- Curvature scale near Sun vs Earth; Schwarzschild intuition (no black holes required for core path)

#### Chapter 7 — Proofs that GR works
- **1919 solar eclipse (Eddington):** starlight deflection near the Sun  
- **GPS / GNSS:** without SR + GR clock corrections, positioning drifts dramatically (order of km/day class error if uncorrected—exact figures cited in content)  
- Optional stretch goals: gravitational redshift, Pound–Rebka, binary pulsars, GW170817  

#### Chapter 8+ — Extensions (backlog)
- Gravitational lensing gallery  
- Frame dragging (Gravity Probe B)  
- Black hole exterior geodesics (educational, not full GR hydro)  
- Historical timeline UI of gravity science  

---

## 6. Functional Requirements

### 6.1 Core platform

| ID | Requirement | Priority |
|----|-------------|----------|
| FR1 | 3D scene engine with free camera (orbit, pan, zoom) | P0 |
| FR2 | Solar system scene: Sun + 8 planets (+ Moon for Earth demos) | P0 |
| FR3 | Time control: pause, 1×, fast-forward, scrub | P0 |
| FR4 | Chapter / demo selector (linear journey + free jump) | P0 |
| FR5 | Side panel: explanation, equations, key facts, sources | P0 |
| FR6 | Highlight / annotate objects and paths in 3D | P0 |
| FR7 | Model switcher: Flat / Newton / SR overlays / GR | P0 |
| FR8 | Unit system: AU, km, days; scientific notation where needed | P1 |
| FR9 | Reset scene to chapter defaults | P0 |
| FR10 | Responsive desktop layout (sidebar + viewport) | P0 |

### 6.2 Demo-specific

| ID | Requirement | Chapter | Priority |
|----|-------------|---------|----------|
| FR11 | Spherical Earth with terminator and latitude markers | 1 | P0 |
| FR12 | Flat-Earth comparison mode (shows inconsistencies) | 1 | P0 |
| FR13 | Horizon disappearance demo | 1 | P1 |
| FR14 | Newtonian N-body or Keplerian orbits for solar system | 2 | P0 |
| FR15 | Force / velocity vectors toggle | 2–3 | P1 |
| FR16 | Interactive gravity sandbox (masses, drag, launch) | 3 | P0 |
| FR17 | Mercury perihelion precession visualization (Newton residual) | 4 | P0 |
| FR18 | Light clock SR demo | 5 | P0 |
| FR19 | Spacetime geodesic visualization for solar system | 6 | P0 |
| FR20 | 1919 eclipse light-bending demo | 7 | P0 |
| FR21 | GPS relativity correction demo (clock rates + map error) | 7 | P0 |

### 6.3 Content & pedagogy

| ID | Requirement | Priority |
|----|-------------|----------|
| FR22 | Every chapter shows the model name, equations, assumptions, and what was verified | P0 |
| FR23 | Citations / further reading links per chapter | P1 |
| FR24 | Glossary of terms (perihelion, geodesic, etc.) | P2 |
| FR25 | “What this demo does / does not claim” honesty notes | P1 |

---

## 7. Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR1 | Runs in modern Chromium/Firefox/Safari; primary target desktop browsers |
| NFR2 | 60 fps on mid-range hardware for solar system view (LOD as needed) |
| NFR3 | Accessibility: keyboard nav for UI; readable contrast; captions for key animations |
| NFR4 | No mandatory backend for core demos (static frontend) |
| NFR5 | Open source license (MIT or similar—confirm at init) |
| NFR6 | Code and content maintainable by contributors unfamiliar with full GR math |

---

## 8. Technical Direction (Initial)

| Layer | Choice (proposal) | Rationale |
|-------|-------------------|-----------|
| App shell | Vite + TypeScript + React | Fast DX, ecosystem |
| 3D | Three.js + React Three Fiber (@react-three/fiber) + Drei | Dominant web 3D stack |
| Math / orbits | Custom + gl-matrix / three math; optional orbital libraries | Control & pedagogy |
| UI | Tailwind or lightweight CSS modules | Clean science UI |
| State | Zustand or React context | Demo + time state |
| Content | MDX or structured JSON chapters | Easy iteration |
| Deploy | Static (GitHub Pages / Cloudflare Pages) | Zero backend |
| Optional later | Tauri desktop wrapper | Offline classroom use |

Physics fidelity strategy:

1. **Pedagogical correctness first** — visuals that teach the right idea  
2. **Document approximations** — e.g. Kepler vs full N-body, 2D spacetime embedding vs 4D  
3. **Progressive fidelity** — chapters can upgrade math without changing UX shell  

---

## 9. Success Metrics

| Metric | Target (v1 public) |
|--------|---------------------|
| All P0 chapters playable end-to-end | Yes |
| User can complete story arc without external tools | Yes |
| No critical console errors on cold start | Yes |
| Educator can jump to any chapter in < 2 clicks | Yes |
| Open-source README enables `npm install && npm run dev` | Yes |

Qualitative:

- A newcomer can explain *why* Newton fails for Mercury after Ch. 4  
- A newcomer can explain *what* the 1919 eclipse measured after Ch. 7  
- A newcomer can explain *why* GPS needs relativity after Ch. 7  

---

## 10. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| GR visualization is misleading (rubber-sheet misconceptions) | Explicit caveats; prefer multiple metaphors (grid warp + geodesic paths + equation) |
| Over-scoping full GR numerics | Use simplified GR orbital corrections and precomputed deflection curves for v1 |
| Flat-Earth chapter perceived as combative | Neutral, geometric, observation-based tone |
| Performance with high poly + particles | LOD, instancing, progressive enhancement |
| Scientific accuracy disputes | Cite primary literature; allow “advanced mode” footnotes |

---

## 11. Content Accuracy Notes (for implementers)

| Topic | Correct framing |
|-------|-----------------|
| Mercury | **Anomalous perihelion precession** (~43″/century); not “retrograde” as the GR proof |
| 1919 eclipse | Light deflection by solar gravity; Eddington expedition; confirmed GR prediction over Newtonian corpuscular models |
| GPS | Satellite clocks: special-relativistic time dilation (velocity) + general-relativistic gravitational redshift (altitude); both matter |
| Earth shape | Oblate spheroid; for demos, sphere is OK with a note on oblateness |
| Retrograde motion | Can appear as a *bonus* astronomy demo (apparent motion), separate from GR |

---

## 12. Open Questions

1. How many optional proof demos beyond eclipse + GPS in v1?  
2. Voiceover / narration audio or text-only?  
3. Multi-language content later?  
4. Strict Kepler vs simplified N-body for Ch. 2?  
5. License choice finalization (MIT recommended)  
6. Branding: final product name / logo  

---

## 13. Release Phases (Summary)

See **PLAN.md** for detailed iterations.

| Phase | Theme | Outcome |
|-------|--------|---------|
| 0 | Project init | Repo, tooling, PRD, PLAN |
| 1 | Shell + solar system | Navigable 3D solar system, app chrome |
| 2 | Earth geometry demos | “Not flat” chapter |
| 3 | Newton + sandbox | Gravity model + pull simulator |
| 4 | Mercury anomaly | Limits of Newton |
| 5 | Special Relativity | Light clock & SR intro |
| 6 | GR geodesics | Spacetime paths in solar system |
| 7 | Proof demos | Eclipse + GPS |
| 8 | Polish & publish | Content pass, a11y, deploy |

---

## 14. Appendix A — Suggested Demo Catalog (v1 + backlog)

### Must-have (v1)

1. Globe vs flat comparison  
2. Horizon / ship demo  
3. Newtonian solar system tour  
4. Gravity pull sandbox  
5. Mercury perihelion anomaly  
6. Light clock (SR)  
7. Spacetime geodesics (solar system)  
8. 1919 eclipse light deflection  
9. GPS relativity correction  

### Strong candidates (v1.1+)

10. Gravitational redshift (tower / Pound–Rebka style)  
11. Apparent planetary retrograde (optics, not GR)  
12. Eratosthenes measurement interactive  
13. Twin paradox simplified  
14. Gravitational lensing of a background star  

### Later / advanced

15. Binary pulsar orbital decay  
16. Gravity Probe B frame dragging  
17. Schwarzschild photon sphere (educational)  
18. Multi-messenger / GW intro  

---

## 15. Appendix B — Equation Surface Area (UI)

Chapters should surface (not necessarily derive fully):

- Newton: \( F = G m_1 m_2 / r^2 \), \( a = GM/r^2 \)  
- Kepler: \( T^2 \propto a^3 \)  
- SR: \( \Delta t' = \gamma \Delta t \), \( \gamma = 1/\sqrt{1-v^2/c^2} \)  
- GR (intro): geodesic equation (schematic), perihelion advance formula (display), light deflection \( \delta = 4GM/(c^2 b) \)  
- GPS: combined rate offset ≈ +38 μs/day class figure (cite exact breakdown in content)

---

*End of PRD v0.1.0*
