type Grid = Map<string, number[]>;
/** Build a uniform-grid hashmap so neighbor look-ups are O(1). */
export declare function createUniformGrid(world: any, h: number): Grid;
/** Iterate nearby particles and run `fn(j)` for each neighbor j. */
export declare function neighbours(eid: number, grid: Grid, h: number, fn: (j: number) => void): void;
export {};
