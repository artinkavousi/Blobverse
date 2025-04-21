"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spawnParticles = void 0;
var ecs_core_1 = require("@blobverse/ecs-core");
var components_1 = require("./components");
var spawnParticles = function (n) {
    if (n === void 0) { n = 2048; }
    for (var i = 0; i < n; i++) {
        var eid = ecs_core_1.World.create();
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
