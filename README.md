# OpenT Spacetime Simulator

Interactive **3D solar system and spacetime simulator** for learning gravity — from everyday evidence that Earth is a sphere, through Newtonian gravity, to Special and General Relativity, and the experiments that confirmed them.

> See gravity. See spacetime. See the proofs.

## Story arc (chapters)

1. **Earth is not flat** — geometry and observation  
2. **Newtonian solar system** — inverse-square gravity & Kepler  
3. **Gravity pull sandbox** — hands-on \(1/r^2\)  
4. **Mercury anomaly** — perihelion precession (limits of Newton)  
5. **Special Relativity** — light clocks & time dilation  
6. **General Relativity & geodesics** — curved spacetime paths  
7. **Proofs of GR** — 1919 eclipse light deflection · GPS relativity  

Full product definition: [`PRD.md`](./PRD.md)  
Living implementation plan: [`PLAN.md`](./PLAN.md)

## Quick start

```bash
cd web
npm install
npm run dev
```

Open the URL Vite prints (default `http://localhost:5173`).

| Script | Description |
|--------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview production build |

## Stack

- **Vite** + **React** + **TypeScript**
- **Three.js** via **React Three Fiber** + **Drei**

## Project layout

```
.
├── PRD.md                 Product requirements
├── PLAN.md                Phased plan + demo inventory
├── README.md
├── LICENSE
└── web/                   Frontend app
    └── src/
        ├── app/           Shell layout
        ├── components/    UI (top bar, chapter panel)
        ├── content/       Chapter copy & schema
        ├── physics/       Orbital data & future physics modules
        ├── scenes/        3D scenes (solar system foundation)
        ├── state/         Simulation / chapter state
        └── styles/        Global CSS
```

## Status

**Phase 0–1 scaffold:** app shell, chapter navigation, and a navigable solar system (circular Keplerian motion) are live. Chapter-specific demos are wired as content placeholders and will be implemented per `PLAN.md`.

## Scientific honesty

- Visual scales are exaggerated so planets remain visible (true scale is pedagogically useless in one viewport).  
- GR “fabric” visuals will be teaching metaphors with explicit caveats.  
- Mercury content uses **perihelion precession**, not apparent retrograde, as the Newtonian residual relevant to GR.

## License

MIT — see [LICENSE](./LICENSE).
