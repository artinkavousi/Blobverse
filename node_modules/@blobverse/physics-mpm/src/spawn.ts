import { World } from '@blobverse/ecs-core';
import { Position, Velocity, MaterialId, Fgrad } from './components';

export const spawnMpmJelly = (nx = 10, ny = 10, spacing = 0.05) => {
  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < ny; j++) {
      const eid = World.create();
      Position.x[eid] = (i - nx / 2) * spacing;
      Position.y[eid] = j * spacing + 0.2;
      Position.z[eid] = 0;
      Velocity.x[eid] = 0;
      Velocity.y[eid] = 0;
      Velocity.z[eid] = 0;
      MaterialId.id[eid] = 1; // jelly material
      // initialize deformation gradient to identity
      Fgrad.xx[eid] = 1;
      Fgrad.yy[eid] = 1;
      Fgrad.zz[eid] = 1;
    }
  }
}; 