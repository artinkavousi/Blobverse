import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { World } from '@blobverse/ecs-core';
import { Position } from '@blobverse/physics-sph';

export function Particles({ world, max = 5_000 }) {
  const positions = new Float32Array(max * 3);

  useFrame(() => {
    let i = 0;
    for (const eid of (world.query ?? [])([Position])) {
      positions[i++] = Position.x[eid];
      positions[i++] = Position.y[eid];
      positions[i++] = Position.z[eid];
      if (i >= max * 3) break;
    }
  });

  return (
    <Points positions={positions} stride={3}>
      <PointMaterial color="#7fd7ff" size={0.02} sizeAttenuation />
    </Points>
  );
} 