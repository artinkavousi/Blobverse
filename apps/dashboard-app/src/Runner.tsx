import { useFrame } from '@react-three/fiber';
import { World } from '@blobverse/ecs-core';

export function Runner() {
  useFrame(() => {
    World.execute();
  });
  return null;
} 