# PLAN.md — OpenT Spacetime Simulator

**Living plan.**  
**Last updated:** 2026-07-22  
**Current phase:** Phase 8 — v1 complete  

---

## Status Legend

| Symbol | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[~]` | In progress |
| `[x]` | Done |
| `[-]` | Deferred |

---

## Overall Roadmap

```
Phase 0  Project init                                 [x]
Phase 1  App shell + solar system                     [x]
Phase 2  Chapter 1 — Earth is not flat                [x]
Phase 3  Chapters 2–3 — Newton + sandbox              [x]
Phase 4  Chapter 4 — Mercury perihelion               [x]
Phase 5  Chapter 5 — Special Relativity               [x]
Phase 6  Chapter 6 — GR geodesics                     [x]
Phase 7  Chapter 7 — Proofs (eclipse, GPS)            [x]
Phase 8  Polish, content, deploy                      [x] v1
```

---

## Demo inventory

| # | Demo | Chapter | Status |
|---|------|---------|--------|
| D0–D2 | Earth lab (rocket, flat, ship, Everest, FOV) | 1 | `[x]` |
| D4–D5 | Newton solar system + vectors | 2 | `[x]` |
| D6 | Gravity sandbox | 3 | `[x]` |
| D7 | Mercury perihelion | 4 | `[x]` |
| D8–D9 | Light clock + length contraction | 5 | `[x]` |
| D10–D11 | GR grid + geodesics | 6 | `[x]` |
| D12–D13 | Eclipse + GPS | 7 | `[x]` |

---

## Phase 5 — Special Relativity `[x]`

- [x] Light clock rest vs moving  
- [x] γ readout, β slider  
- [x] Length contraction demo  
- [x] GPS SR teaser in copy  

**Code:** `SpecialRelativityScene.tsx`, `SrHud.tsx`, `srStore.ts`, `relativity.ts`

---

## Phase 6 — General Relativity `[x]`

- [x] Warped fabric grid + mass slider  
- [x] Geodesic orbits (Mercury/Earth/Jupiter)  
- [x] Force vs geodesic picture  
- [x] Photon path; honesty metaphor note  

**Code:** `GeneralRelativityScene.tsx`, `GrHud.tsx`, `grStore.ts`

---

## Phase 7 — Proofs of GR `[x]`

- [x] 1919 eclipse: none / Newton / GR deflection  
- [x] GPS: SR+GR toggles, map error accumulation  
- [x] Proof gallery notes  

**Code:** `ProofsScene.tsx`, `ProofsHud.tsx`, `proofsStore.ts`

---

## Phase 8 — Polish `[x]` v1

- [x] All chapters `available`  
- [x] Unified App routing by chapter  
- [x] Top bar shortcuts per lab  
- [x] README + PLAN updated  
- [x] Production build passes  
- [ ] Optional later: Eratosthenes, eccentric orbits, drag-aim sandbox, formal citations  

---

## Progress log

| Date | Update |
|------|--------|
| 2026-07-21 | Project init through Phase 4 (Earth, Newton, sandbox, Mercury). |
| 2026-07-22 | Phases 5–7 implemented (SR, GR, proofs). Full story arc v1. Build + review. |

---

*Update this file when status changes.*
