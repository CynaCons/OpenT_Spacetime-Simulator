# OpenT Spacetime Simulator

Interactive **3D solar system and spacetime simulator** for learning gravity — from everyday evidence that Earth is a sphere, through Newtonian gravity, to Special and General Relativity, and the experiments that confirmed them.

> See gravity. See spacetime. See the proofs.

## Live demo (GitHub Pages)

**https://cynacons.github.io/OpenT_Spacetime-Simulator/**

| | |
|--|--|
| **Live app** | https://cynacons.github.io/OpenT_Spacetime-Simulator/ |
| **Source** | https://github.com/CynaCons/OpenT_Spacetime-Simulator |
| **Docs** | [PRD.md](./PRD.md) · [PLAN.md](./PLAN.md) |

---

## Story arc (all chapters interactive)

| # | Chapter | Highlights |
|---|---------|------------|
| 1 | Earth is not flat | Rocket ascent, ship/horizon, Everest ranges, FOV |
| 2 | Newtonian solar system | Force/velocity vectors, Kepler T²/a³ tour |
| 3 | Gravity sandbox | Place masses, trails, G, escape speed |
| 4 | Mercury anomaly | Perihelion residual ~43″/cy (not retrograde) |
| 5 | Special Relativity | Light clocks, γ, length contraction |
| 6 | General Relativity | Warped grid metaphor, geodesics, photons |
| 7 | Proofs of GR | 1919 eclipse deflection · GPS SR+GR clocks |

---

## Quick start (local)

```bash
git clone https://github.com/CynaCons/OpenT_Spacetime-Simulator.git
cd OpenT_Spacetime-Simulator/web
npm install
npm run dev
```

| Script | Description |
|--------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Typecheck + production build (Pages base path) |
| `npm run preview` | Preview production build |

---

## Stack

- Vite · React · TypeScript  
- Three.js · React Three Fiber · Drei  
- GitHub Actions → GitHub Pages  

---

## Project layout

```
web/src/
  app/           Shell
  components/    HUDs + chrome
  content/       Chapter copy
  physics/       Earth, Newton, Mercury, relativity
  scenes/        3D labs per chapter
  state/         Stores
```

---

## Status

**v1 story arc complete (Chapters 1–7).** Pedagogical simulations with honesty notes on approximations. See [PLAN.md](./PLAN.md).

---

## Scientific honesty

- Visual scales and precession rates are often exaggerated for teaching; readouts cite real figures where it matters.  
- GR “fabric” is a metaphor, not literal 4D spacetime.  
- GPS/eclipse numbers are standard order-of-magnitude teaching values.

---

## License

MIT — see [LICENSE](./LICENSE).
