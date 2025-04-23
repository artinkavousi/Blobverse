export interface Vec3 {
    x: number;
    y: number;
    z: number;
}
export declare const length: (v: Vec3) => number;
export declare const poly6: (r: number, h: number) => number;
export declare const spikyGrad: (r: number, h: number) => number;
export declare const viscLaplace: (r: number, h: number) => number;
