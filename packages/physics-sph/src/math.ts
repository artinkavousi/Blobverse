// SPH kernel functions & helpers
export interface Vec3 { x: number; y: number; z: number; }

export const length = (v: Vec3) =>
  Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

// Poly‑6 density kernel
export const poly6 = (r: number, h: number) =>
  r >= 0 && r <= h
    ? (315 / (64 * Math.PI * Math.pow(h, 9))) *
      Math.pow(h * h - r * r, 3)
    : 0;

// Spiky pressure‑gradient kernel
export const spikyGrad = (r: number, h: number) =>
  r > 0 && r <= h
    ? (-45 / (Math.PI * Math.pow(h, 6))) * Math.pow(h - r, 2)
    : 0;

// Viscosity Laplacian
export const viscLaplace = (r: number, h: number) =>
  r >= 0 && r <= h
    ? (45 / (Math.PI * Math.pow(h, 6))) * (h - r)
    : 0; 