import { World } from '@blobverse/ecs-core';
import { Position, Velocity, Fluid } from './components';

export const spawnParticles = (n = 2048) => {
  for (let i = 0; i < n; i++) {
    const eid = World.create();
    Position.x[eid] = (Math.random() - 0.5) * 0.3;
    Position.y[eid] = Math.random() * 0.3 + 0.2;
    Position.z[eid] = (Math.random() - 0.5) * 0.3;
    Velocity.x[eid] = 0;
    Velocity.y[eid] = 0;
    Velocity.z[eid] = 0;
    Fluid.density[eid] = 0;
    Fluid.pressure[eid] = 0;
  }
}; 