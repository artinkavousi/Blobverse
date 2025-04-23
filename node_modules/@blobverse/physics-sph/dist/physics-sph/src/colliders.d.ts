export type Collider = {
    kind: 'plane';
    n: [number, number, number];
    d: number;
} | {
    kind: 'sphere';
    c: [number, number, number];
    r: number;
} | {
    kind: 'box';
    c: [number, number, number];
    e: [number, number, number];
};
export declare const colliders: Collider[];
