"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fluid = exports.Velocity = exports.Position = void 0;
var bitecs_1 = require("bitecs");
/** Position (x,y,z) in world space - meters */
exports.Position = (0, bitecs_1.defineComponent)({
    x: bitecs_1.Types.f32,
    y: bitecs_1.Types.f32,
    z: bitecs_1.Types.f32,
});
/** Velocity (m s⁻¹) */
exports.Velocity = (0, bitecs_1.defineComponent)({
    x: bitecs_1.Types.f32,
    y: bitecs_1.Types.f32,
    z: bitecs_1.Types.f32,
});
/** Density + Pressure scalars (SPH) */
exports.Fluid = (0, bitecs_1.defineComponent)({
    density: bitecs_1.Types.f32,
    pressure: bitecs_1.Types.f32,
});
