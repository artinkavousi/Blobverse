import { defineQuery, enterQuery } from 'bitecs';
import { Position } from './components';

type Grid = Map<string, number[]>;

const key = (x: number, y: number, z: number, h: number) =>
  `${Math.floor(x / h)}_${Math.floor(y / h)}_${Math.floor(z / h)}`;

/** Build a uniform-grid hashmap so neighbor look-ups are O(1). */
export function createUniformGrid(world: any, h: number): Grid {
  const map: Grid = new Map();
  const q = enterQuery(defineQuery([Position]))(world);
  for (const eid of q) {
    const k = key(Position.x[eid], Position.y[eid], Position.z[eid], h);
    const cell = map.get(k) ?? [];
    cell.push(eid);
    map.set(k, cell);
  }
  return map;
}

/** Iterate nearby particles and run `fn(j)` for each neighbor j. */
export function neighbours(
  eid: number,
  grid: Grid,
  h: number,
  fn: (j: number) => void
) {
  const baseKey = key(Position.x[eid], Position.y[eid], Position.z[eid], h);
  const [cx, cy, cz] = baseKey.split('_').map(Number);

  for (let dx = -1; dx <= 1; dx++)
    for (let dy = -1; dy <= 1; dy++)
      for (let dz = -1; dz <= 1; dz++) {
        const cell = grid.get(`${cx + dx}_${cy + dy}_${cz + dz}`);
        if (!cell) continue;
        for (const j of cell) fn(j);
      }
} 