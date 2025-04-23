import { World, register } from '@blobverse/ecs-core';
import { Position, Velocity, Fluid } from './components';
import { createUniformGrid, neighbours } from './spatial-hash';
import {
  poly6,
  spikyGrad,
  viscLaplace,
  length,
  Vec3,
} from './math';
import { SPHParams } from './types';

/**
 * Simple CPU‑side SPH prototype.
 *   – good for debugging    👓
 *   – will be replaced by GPU compute in Milestone 3
 */
export class SphSystem {
  constructor(private params: Partial<SPHParams> = {}) {}

  execute(world: any) {
    const { h, restDensity, k, mu, g, dt } = { ...defaultParams, ...this.params };

    // 1. build neighbour grid
    const grid = createUniformGrid(world, h);

    // 2. density & pressure
    for (const eid of world.query([Position, Fluid] as any)) {
      let rho = 0;
      neighbours(eid, grid, h, (j: number) => {
        if (j === eid) return;
        const rVec: Vec3 = {
          x: Position.x[eid] - Position.x[j],
          y: Position.y[eid] - Position.y[j],
          z: Position.z[eid] - Position.z[j],
        };
        const r = length(rVec);
        rho += poly6(r, h);
      });
      Fluid.density[eid] = rho;
      Fluid.pressure[eid] = k * (rho - restDensity);
    }

    // 3. forces
    for (const eid of world.query([Position, Velocity, Fluid] as any)) {
      let fX = 0, fY = -g, fZ = 0;
      neighbours(eid, grid, h, (j: number) => {
        if (j === eid) return;
        const rVec: Vec3 = {
          x: Position.x[eid] - Position.x[j],
          y: Position.y[eid] - Position.y[j],
          z: Position.z[eid] - Position.z[j],
        };
        const r = length(rVec);
        // pressure
        const pTerm = -(Fluid.pressure[eid] + Fluid.pressure[j]) / (2 * Fluid.density[j]);
        const grad = spikyGrad(r, h);
        fX += pTerm * grad * rVec.x;
        fY += pTerm * grad * rVec.y;
        fZ += pTerm * grad * rVec.z;
        // viscosity
        const uij = {
          x: Velocity.x[j] - Velocity.x[eid],
          y: Velocity.y[j] - Velocity.y[eid],
          z: Velocity.z[j] - Velocity.z[eid],
        };
        const visc = mu * viscLaplace(r, h);
        fX += visc * uij.x;
        fY += visc * uij.y;
        fZ += visc * uij.z;
      });
      // integrate (semi-implicit Euler)
      Velocity.x[eid] += fX * dt;
      Velocity.y[eid] += fY * dt;
      Velocity.z[eid] += fZ * dt;
      Position.x[eid] += Velocity.x[eid] * dt;
      Position.y[eid] += Velocity.y[eid] * dt;
      Position.z[eid] += Velocity.z[eid] * dt;
    }
  }
}

export const defaultParams: SPHParams = {
  h: 0.04,
  restDensity: 1000,
  k: 4,
  mu: 0.1,
  g: 9.81,
  dt: 0.016,
};

// auto-register
register(SphSystem); 