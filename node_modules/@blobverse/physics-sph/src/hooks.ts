import { useSyncExternalStore } from 'react';
import { JumpFloodSdfSystem } from './JumpFloodSdfSystem';

// Hook that returns the current SDF texture and triggers on each SDF compute
export function useJumpFloodSdf() {
  return useSyncExternalStore(
    (callback) => {
      // no-op: R3F frame loop updates texture in RayMarchMesh
      return () => {};
    },
    () => JumpFloodSdfSystem.instance?.texture
  );
} 