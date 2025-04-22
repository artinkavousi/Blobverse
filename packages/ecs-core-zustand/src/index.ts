import create from 'zustand';
import type { SPHParams } from '@blobverse/physics-sph';

// Global store for SPH parameters
export interface StoreState extends SPHParams {
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
  planeHeight: -0.02,
  boxSize: 0.05,
  boxY: 0.15,
})); 