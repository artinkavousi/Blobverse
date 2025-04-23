"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUniformGrid = createUniformGrid;
exports.neighbours = neighbours;
const bitecs_1 = require("bitecs");
const components_1 = require("./components");
const key = (x, y, z, h) => `${Math.floor(x / h)}_${Math.floor(y / h)}_${Math.floor(z / h)}`;
/** Build a uniform-grid hashmap so neighbor look-ups are O(1). */
function createUniformGrid(world, h) {
    const map = new Map();
    const q = (0, bitecs_1.enterQuery)((0, bitecs_1.defineQuery)([components_1.Position]))(world);
    for (const eid of q) {
        const k = key(components_1.Position.x[eid], components_1.Position.y[eid], components_1.Position.z[eid], h);
        const cell = map.get(k) ?? [];
        cell.push(eid);
        map.set(k, cell);
    }
    return map;
}
/** Iterate nearby particles and run `fn(j)` for each neighbor j. */
function neighbours(eid, grid, h, fn) {
    const baseKey = key(components_1.Position.x[eid], components_1.Position.y[eid], components_1.Position.z[eid], h);
    const [cx, cy, cz] = baseKey.split('_').map(Number);
    for (let dx = -1; dx <= 1; dx++)
        for (let dy = -1; dy <= 1; dy++)
            for (let dz = -1; dz <= 1; dz++) {
                const cell = grid.get(`${cx + dx}_${cy + dy}_${cz + dz}`);
                if (!cell)
                    continue;
                for (const j of cell)
                    fn(j);
            }
}
