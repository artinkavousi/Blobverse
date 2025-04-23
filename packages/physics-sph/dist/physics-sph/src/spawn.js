"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spawnParticles = void 0;
const ecs_core_1 = require("@blobverse/ecs-core");
const components_1 = require("./components");
const spawnParticles = (n = 2048) => {
    for (let i = 0; i < n; i++) {
        const eid = ecs_core_1.World.create();
        components_1.Position.x[eid] = (Math.random() - 0.5) * 0.3;
        components_1.Position.y[eid] = Math.random() * 0.3 + 0.2;
        components_1.Position.z[eid] = (Math.random() - 0.5) * 0.3;
        components_1.Velocity.x[eid] = 0;
        components_1.Velocity.y[eid] = 0;
        components_1.Velocity.z[eid] = 0;
        components_1.Fluid.density[eid] = 0;
        components_1.Fluid.pressure[eid] = 0;
    }
};
exports.spawnParticles = spawnParticles;
