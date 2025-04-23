import { World } from '@blobverse/ecs-core';
export declare class JumpFloodSdfSystem {
    static instance: JumpFloodSdfSystem;
    private sdf;
    constructor();
    execute(world: World): void;
    get texture(): any;
}
