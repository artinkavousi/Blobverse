"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SdfCollisionSystem = void 0;
const ecs_core_1 = require("@blobverse/ecs-core");
const components_1 = require("./components");
const colliders_1 = require("./colliders");
const math_1 = require("./math");
const ecs_core_zustand_1 = require("@blobverse/ecs-core-zustand");
// Compute signed distance to all analytic colliders
function signedDistance(pos) {
    let d = -Infinity;
    for (const c of colliders_1.colliders) {
        if (c.kind === 'plane') {
            const current = pos.x * c.n[0] + pos.y * c.n[1] + pos.z * c.n[2] + c.d;
            d = Math.max(d, current);
        }
        else if (c.kind === 'sphere') {
            const dx = pos.x - c.c[0], dy = pos.y - c.c[1], dz = pos.z - c.c[2];
            d = Math.max(d, (0, math_1.length)({ x: dx, y: dy, z: dz }) - c.r);
        }
        else if (c.kind === 'box') {
            const dx = Math.max(Math.abs(pos.x - c.c[0]) - c.e[0], 0);
            const dy = Math.max(Math.abs(pos.y - c.c[1]) - c.e[1], 0);
            const dz = Math.max(Math.abs(pos.z - c.c[2]) - c.e[2], 0);
            d = Math.max(d, (0, math_1.length)({ x: dx, y: dy, z: dz }));
        }
    }
    return d;
}
// CPU collision system: pushes particles out of colliders and bounces
class SdfCollisionSystem {
    execute(world) {
        // update colliders from UI state
        const { planeHeight, boxSize, boxY } = ecs_core_zustand_1.useStore.getState();
        colliders_1.colliders[0].d = planeHeight;
        colliders_1.colliders[1].c[1] = boxY;
        colliders_1.colliders[1].e = [boxSize, boxSize, boxSize];
        for (const eid of world.query([components_1.Position, components_1.Velocity])) {
            const p = { x: components_1.Position.x[eid], y: components_1.Position.y[eid], z: components_1.Position.z[eid] };
            const dist = signedDistance(p);
            if (dist < 0) {
                // approximate normal by finite differences
                const eps = 0.001;
                const grad = {
                    x: signedDistance({ x: p.x + eps, y: p.y, z: p.z }) - dist,
                    y: signedDistance({ x: p.x, y: p.y + eps, z: p.z }) - dist,
                    z: signedDistance({ x: p.x, y: p.y, z: p.z + eps }) - dist,
                };
                const gLen = (0, math_1.length)(grad) + 1e-6;
                // push out
                components_1.Position.x[eid] += (-dist) * grad.x / gLen;
                components_1.Position.y[eid] += (-dist) * grad.y / gLen;
                components_1.Position.z[eid] += (-dist) * grad.z / gLen;
                // simple bounce
                components_1.Velocity.x[eid] *= 0.5;
                components_1.Velocity.y[eid] *= -0.3;
                components_1.Velocity.z[eid] *= 0.5;
            }
        }
    }
}
exports.SdfCollisionSystem = SdfCollisionSystem;
(0, ecs_core_1.register)(SdfCollisionSystem);
