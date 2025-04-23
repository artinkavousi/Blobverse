import type { SPHParams } from '@blobverse/physics-sph';
import type { MpmParams } from '@blobverse/physics-mpm';
export interface StoreState extends SPHParams, MpmParams {
    planeHeight: number;
    boxSize: number;
    boxY: number;
}
export declare const useStore: import("zustand").UseBoundStore<import("zustand").StoreApi<StoreState>>;
