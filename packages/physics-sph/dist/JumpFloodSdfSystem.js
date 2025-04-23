"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JumpFloodSdfSystem = void 0;
const gpu_distance_field_1 = require("gpu-distance-field");
const ecs_core_1 = require("@blobverse/ecs-core");
const components_1 = require("./components");
class JumpFloodSdfSystem {
    constructor() {
        this.sdf = (0, gpu_distance_field_1.createSDFGenerator)({ width: 512, height: 512 });
        JumpFloodSdfSystem.instance = this;
    }
    execute(world) {
        this.sdf.begin();
        for (const eid of world.query([components_1.Position])) {
            this.sdf.seed(components_1.Position.x[eid], components_1.Position.y[eid]);
        }
        this.sdf.compute();
    }
    // expose the SDF texture
    get texture() {
        return this.sdf.texture;
    }
}
exports.JumpFloodSdfSystem = JumpFloodSdfSystem;
(0, ecs_core_1.register)(JumpFloodSdfSystem);
