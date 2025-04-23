import { SPHParams } from './types';
/**
 * Simple CPU‑side SPH prototype.
 *   – good for debugging    👓
 *   – will be replaced by GPU compute in Milestone 3
 */
export declare class SphSystem {
    private params;
    constructor(params?: Partial<SPHParams>);
    execute(world: any): void;
}
export declare const defaultParams: SPHParams;
