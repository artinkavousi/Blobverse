export type Collider =
  | { kind: 'plane'; n: [number, number, number]; d: number }
  | { kind: 'sphere'; c: [number, number, number]; r: number }
  | { kind: 'box';    c: [number, number, number]; e: [number, number, number] };

export const colliders: Collider[] = [
  { kind: 'plane', n: [0, 1, 0], d: -0.02 },                 // floor
  { kind: 'box',   c: [0.2, 0.15, 0], e: [0.05, 0.05, 0.05] }  // user box
]; 