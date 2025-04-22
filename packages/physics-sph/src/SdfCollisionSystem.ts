import { World, register } from '@blobverse/ecs-core';
import { Position, Velocity } from './components';
import { colliders } from './colliders';
import { Vec3, length } from './math';
import { useStore } from '@blobverse/ecs-core-zustand';

// Compute signed distance to all analytic colliders
function signedDistance(pos: Vec3): number {
  let d = -Infinity;
  for (const c of colliders) {
    if (c.kind === 'plane') {
      const current = pos.x * c.n[0] + pos.y * c.n[1] + pos.z * c.n[2] + c.d;
      d = Math.max(d, current);
    } else if (c.kind === 'sphere') {
      const dx = pos.x - c.c[0], dy = pos.y - c.c[1], dz = pos.z - c.c[2];
      d = Math.max(d, length({ x: dx, y: dy, z: dz }) - c.r);
    } else if (c.kind === 'box') {
      const dx = Math.max(Math.abs(pos.x - c.c[0]) - c.e[0], 0);
      const dy = Math.max(Math.abs(pos.y - c.c[1]) - c.e[1], 0);
      const dz = Math.max(Math.abs(pos.z - c.c[2]) - c.e[2], 0);
      d = Math.max(d, length({ x: dx, y: dy, z: dz }));
    }
  }
  return d;
}

// CPU collision system: pushes particles out of colliders and bounces
export class SdfCollisionSystem {
  execute(world: World) {
    // update colliders from UI state
    const { planeHeight, boxSize, boxY } = useStore.getState();
    colliders[0].d = planeHeight;
    colliders[1].c[1] = boxY;
    colliders[1].e = [boxSize, boxSize, boxSize];

    for (const eid of world.query([Position, Velocity])) {
      const p: Vec3 = { x: Position.x[eid], y: Position.y[eid], z: Position.z[eid] };
      const dist = signedDistance(p);
      if (dist < 0) {
        // approximate normal by finite differences
        const eps = 0.001;
        const grad = {
          x: signedDistance({ x: p.x + eps, y: p.y, z: p.z }) - dist,
          y: signedDistance({ x: p.x, y: p.y + eps, z: p.z }) - dist,
          z: signedDistance({ x: p.x, y: p.y, z: p.z + eps }) - dist,
        };
        const gLen = length(grad) + 1e-6;
        // push out
        Position.x[eid] += (-dist) * grad.x / gLen;
        Position.y[eid] += (-dist) * grad.y / gLen;
        Position.z[eid] += (-dist) * grad.z / gLen;
        // simple bounce
        Velocity.x[eid] *= 0.5;
        Velocity.y[eid] *= -0.3;
        Velocity.z[eid] *= 0.5;
      }
    }
  }
}

register(SdfCollisionSystem); 