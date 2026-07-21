# OpenT Spacetime Simulator

Interactive **3D solar system and spacetime simulator** for learning gravity — from everyday evidence that Earth is a sphere, through Newtonian gravity, to Special and General Relativity, and the experiments that confirmed them.

> See gravity. See spacetime. See the proofs.

## Live demo (GitHub Pages)

**Open the simulator:**  
**https://cynacons.github.io/OpenT_Spacetime-Simulator/**

> URL uses the GitHub username that owns the repo. If the link 404s right after the first push, wait for the **Deploy GitHub Pages** workflow to finish (Actions tab), and ensure Pages is set to **GitHub Actions**.

| | |
|--|--|
| **Live app** | https://cynacons.github.io/OpenT_Spacetime-Simulator/ |
| **Source** | https://github.com/CynaCons/OpenT_Spacetime-Simulator |
| **Product docs** | [PRD.md](./PRD.md) · [PLAN.md](./PLAN.md) |

### Controls (viewport)

| Input | Action |
|-------|--------|
| Left-drag | Orbit around the current center |
| Scroll | Zoom in/out (toward the center) |
| Right-drag (or middle) | **Move the zoom/orbit center** (switches to Free) |
| Click planet | Select |
| Double-click planet / Sun | Focus camera center on that body |
| **Center → Sun / Earth / Selected / Free** | Set orbit center from the toolbar |
| **Reset view** | Sun center + default camera distance |

---

## Story arc (chapters)

1. **Earth is not flat** — geometry and observation (rocket altitude / curvature planned)  
2. **Newtonian solar system** — inverse-square gravity & Kepler  
3. **Gravity pull sandbox** — hands-on \(1/r^2\)  
4. **Mercury anomaly** — perihelion precession (limits of Newton)  
5. **Special Relativity** — light clocks & time dilation  
6. **General Relativity & geodesics** — curved spacetime paths  
7. **Proofs of GR** — 1919 eclipse light deflection · GPS relativity  

---

## Quick start (local)

```bash
git clone https://github.com/CynaCons/OpenT_Spacetime-Simulator.git
cd OpenT_Spacetime-Simulator/web
npm install
npm run dev
```

Open the URL Vite prints (default `http://localhost:5173`).

| Script | Description |
|--------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Typecheck + production build (base path for Pages) |
| `npm run preview` | Preview production build |

---

## Stack

- **Vite** + **React** + **TypeScript**
- **Three.js** via **React Three Fiber** + **Drei**
- Deploy: **GitHub Actions → GitHub Pages** (see `.github/workflows/deploy-pages.yml`)

---

## Project layout

```
.
├── PRD.md                 Product requirements
├── PLAN.md                Phased plan + demo inventory
├── README.md
├── LICENSE
├── .github/workflows/     Pages deploy
└── web/                   Frontend app
    └── src/
        ├── app/           Shell layout
        ├── components/    UI (top bar, chapter panel)
        ├── content/       Chapter copy & schema
        ├── physics/       Orbital data & future physics modules
        ├── scenes/        3D scenes + camera rig
        ├── state/         Simulation / chapter / camera state
        └── styles/        Global CSS
```

---

## Status

**Phase 0–1:** app shell, solar system, camera centers, GitHub Pages.

**Phase 2 (Chapter 1) — mature v1:** dedicated Earth lab with **rocket ascent** (sphere vs flat), horizon geometry readouts, teaching scale, and **ship/horizon** demo. See [PLAN.md](./PLAN.md).

**Next:** Phase 3 — Newtonian solar system tour + gravity sandbox.

---

## Scientific honesty

- Visual scales are exaggerated so planets remain visible (true scale is pedagogically useless in one viewport).  
- GR “fabric” visuals will be teaching metaphors with explicit caveats.  
- Mercury content uses **perihelion precession**, not apparent retrograde, as the Newtonian residual relevant to GR.

---

## License

MIT — see [LICENSE](./LICENSE).
