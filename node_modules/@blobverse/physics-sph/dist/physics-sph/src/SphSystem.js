"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultParams = exports.SphSystem = void 0;
const ecs_core_1 = require("@blobverse/ecs-core");
const components_1 = require("./components");
const spatial_hash_1 = require("./spatial-hash");
const math_1 = require("./math");
/**
 * Simple CPU‑side SPH prototype.
 *   – good for debugging    👓
 *   – will be replaced by GPU compute in Milestone 3
 */
class SphSystem {
    constructor(params = {}) {
        this.params = params;
    }
    execute(world) {
        const { h, restDensity, k, mu, g, dt } = { ...exports.defaultParams, ...this.params };
        // 1. build neighbour grid
        const grid = (0, spatial_hash_1.createUniformGrid)(world, h);
        // 2. density & pressure
        for (const eid of world.query([components_1.Position, components_1.Fluid])) {
            let rho = 0;
            (0, spatial_hash_1.neighbours)(eid, grid, h, (j) => {
                if (j === eid)
                    return;
                const rVec = {
                    x: components_1.Position.x[eid] - components_1.Position.x[j],
                    y: components_1.Position.y[eid] - components_1.Position.y[j],
                    z: components_1.Position.z[eid] - components_1.Position.z[j],
                };
                const r = (0, math_1.length)(rVec);
                rho += (0, math_1.poly6)(r, h);
            });
            components_1.Fluid.density[eid] = rho;
            components_1.Fluid.pressure[eid] = k * (rho - restDensity);
        }
        // 3. forces
        for (const eid of world.query([components_1.Position, components_1.Velocity, components_1.Fluid])) {
            let fX = 0, fY = -g, fZ = 0;
            (0, spatial_hash_1.neighbours)(eid, grid, h, (j) => {
                if (j === eid)
                    return;
                const rVec = {
                    x: components_1.Position.x[eid] - components_1.Position.x[j],
                    y: components_1.Position.y[eid] - components_1.Position.y[j],
                    z: components_1.Position.z[eid] - components_1.Position.z[j],
                };
                const r = (0, math_1.length)(rVec);
                // pressure
                const pTerm = -(components_1.Fluid.pressure[eid] + components_1.Fluid.pressure[j]) / (2 * components_1.Fluid.density[j]);
                const grad = (0, math_1.spikyGrad)(r, h);
                fX += pTerm * grad * rVec.x;
                fY += pTerm * grad * rVec.y;
                fZ += pTerm * grad * rVec.z;
                // viscosity
                const uij = {
                    x: components_1.Velocity.x[j] - components_1.Velocity.x[eid],
                    y: components_1.Velocity.y[j] - components_1.Velocity.y[eid],
                    z: components_1.Velocity.z[j] - components_1.Velocity.z[eid],
                };
                const visc = mu * (0, math_1.viscLaplace)(r, h);
                fX += visc * uij.x;
                fY += visc * uij.y;
                fZ += visc * uij.z;
            });
            // integrate (semi-implicit Euler)
            components_1.Velocity.x[eid] += fX * dt;
            components_1.Velocity.y[eid] += fY * dt;
            components_1.Velocity.z[eid] += fZ * dt;
            components_1.Position.x[eid] += components_1.Velocity.x[eid] * dt;
            components_1.Position.y[eid] += components_1.Velocity.y[eid] * dt;
            components_1.Position.z[eid] += components_1.Velocity.z[eid] * dt;
        }
    }
}
exports.SphSystem = SphSystem;
exports.defaultParams = {
    h: 0.04,
    restDensity: 1000,
    k: 4,
    mu: 0.1,
    g: 9.81,
    dt: 0.016,
};
// auto-register
(0, ecs_core_1.register)(SphSystem);
