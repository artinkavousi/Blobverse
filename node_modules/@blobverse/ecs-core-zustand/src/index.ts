import create from 'zustand';
import type { SPHParams } from '@blobverse/physics-sph';
import type { MpmParams } from '@blobverse/physics-mpm';

// Global store for SPH parameters
export interface StoreState extends SPHParams, MpmParams {
  planeHeight: number;
  boxSize: number;
  boxY: number;
}

export const useStore = create<StoreState>(() => ({
  h: 0.04,
  restDensity: 1000,
  k: 4,
  mu: 0.1,
  g: 9.81,
  dt: 0.016,
  // MPM defaults
  youngModulus: 400,
  poissonRatio: 0.2,
  yield: 2,
  plasticHardening: 10,
  planeHeight: -0.02,
  boxSize: 0.05,
  boxY: 0.15,
})); 