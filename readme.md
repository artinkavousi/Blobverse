# Blobverse

A modular, GPU-accelerated blob simulation platform for WebGL/WebGPU + React, featuring:

- **Particle Systems**: SPH fluid, MPC-MLS, MPM continuum sim
- **Signed Distance Fields**: Jump-Flood SDF, ray-marched surfaces
- **Reaction-Diffusion**: Real-time Gray-Scott patterns advected by flow
- **Modular Architecture**: ECS engine, swap-in physics modules, plugin-friendly
- **Interactive Dashboard**: React Three Fiber + Leva controls + Storybook
- **Comprehensive Docs**: Docusaurus site with tutorials, API guide, live demos

---

## 🧭 Development Plan & Architecture

### 1. Planning & Architecture Overview

Blobverse is designed around **component modularity**, **GPU compute**, and **cross-system hot-swappability**. The pipeline supports:

- Hybrid WebGL/WebGPU rendering and compute paths.
- A clean Entity-Component-System (ECS) backend for high-performance and flexible data updates.
- Shader-first physics and effects pipeline, where compute passes are dynamically composed.

### 2. Core Toolchain

| Layer | Tool/Library | Purpose |
|-------|--------------|---------|
| UI    | React, Leva, R3F | UI controls, 3D scene, live bindings |
| Simulation Core | `bitecs` + `Inversify` | ECS + Dependency Injection |
| Compute | WebGL (`GPUComputationRenderer`) + WebGPU (WGSL) | Cross-backend compute shaders |
| Docs   | Docusaurus v2 + MDX | Learning portal, plugin docs, API guide |
| DevOps | Turborepo + pnpm + Changesets | Monorepo + fast builds + versioning |
| CI/CD  | GitHub Actions + Vercel/Cloudflare | Automated testing + preview deploys |

---

### 3. Directory Structure

```
blobverse/
├─ apps/
│  ├─ dashboard-app/        R3F + control panel + blob runtime
│  └─ docs-site/            Docusaurus 2 documentation
├─ packages/
│  ├─ ecs-core/             ECS + DI + system registry
│  ├─ physics-sph/          Smoothed-particle hydrodynamics module
│  ├─ physics-mpm/          MPM/MLS-MPM solver for solids/sand
│  ├─ physics-gravity/      Gravity-only point system
│  ├─ field-rd/             Reaction-diffusion Gray-Scott shader module
│  └─ vis-shaders/          Shared shader chunks, ray-march material
├─ scripts/                 Dev scaffolding (create module, build shader graph)
└─ .github/workflows/       CI/CD and test pipelines
```

---

### 4. Development Phases

#### Phase 1 — Bootstrap & ECS Engine
- Setup monorepo (Turborepo, pnpm)
- Build `ecs-core` with `bitecs`, system registry, DI container
- Setup dashboard UI with canvas, OrbitControls, Leva panel
- Integrate Zustand store for shared UI → physics state sync

#### Phase 2 — SPH Fluid Base
- Implement CPU-side SPH module for debug and dev
- Add GPU shader compute path (WebGL)
- Add WGSL WebGPU compute fallback
- Bind parameters to Leva dynamically using metadata.json
- Render with instanced `<Points />` and Matcap preview

#### Phase 3 — Surface Mesh & SDF Collisions
- Add MarchingCubes (WebGL) & Ray-march Material (WebGPU)
- Integrate Jump-Flood Algorithm (JFA) for real-time SDF
- Add `SdfCollisionSystem` with analytic + texture colliders

#### Phase 4 — MPM Continuum Mechanics
- Port EA PB-MPM kernels to WGSL
- Hot-swap SPH ⇄ MPM via Leva or runtime call
- Support per-particle material switching (fluid, sand, jelly)
- Visualize via same metaball pipeline

#### Phase 5 — Reaction-Diffusion
- Add `field-rd` with Gray-Scott reaction shader
- Add advection pass using fluid velocity field
- Skin blobs via RD texture on raymarch material
- Add presets and color palette interpolation

#### Phase 6 — Final Polish & Ecosystem
- Create plugin manifest system (auto-import with metadata)
- Setup `blobby-cli` to scaffold new systems
- Finalize docs with versioned Docusaurus site
- CI smoke tests + visual regression (Playwright)

---

## ✅ Best Practices & Patterns

- **Dependency Injection** via `InversifyJS` → each module only registers systems, no imports across modules.
- **Modular Shaders**: WGSL and GLSL chunks use `#include` pre-processing to dynamically compose.
- **Plugin Isolation**: Each package builds independently, tests compute logic, and exports Leva metadata.
- **Docs Co-located**: Each system has matching `.mdx` story + API reference page.
- **WebGL/WebGPU parity**: All core compute shaders have a fallback (same math path in both).

---

## 🧪 Testing & Deployment

### CI Pipelines
- Lint + Typecheck → Unit tests → Build artifacts → Preview deploy (per PR)
- Vercel: WebGL/React paths (`/mesh`, `/rd`, `/demo`)
- Cloudflare Pages: WebGPU targets (`/ray`, `/gpu`)

### Testing
- Use Playwright for DOM + shader test snapshots
- Use Spector.js for GPU profiling (manually embedded in dev builds)

---

## 🧩 Future: Plugin Ecosystem

Each physics or shader system is a hot-loadable, self-contained plugin:

```ts
engine.load('plugin:@blobverse/physics-vorton')
```

Auto-injects ECS components, systems, UI controls, docs.

Coming soon:
- Shader graph editor
- Sound-reactive shader modules
- Multiplayer blob field (WebRTC/WebSocket sync)

---

## License

MIT © [Your Name]  
Contributions welcome — fork, clone, extend your Blobbyverse 🫧

