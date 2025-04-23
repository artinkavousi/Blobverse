"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialId = exports.Fgrad = exports.Velocity = exports.Position = void 0;
const bitecs_1 = require("bitecs");
exports.Position = (0, bitecs_1.defineComponent)({ x: bitecs_1.Types.f32, y: bitecs_1.Types.f32, z: bitecs_1.Types.f32 });
exports.Velocity = (0, bitecs_1.defineComponent)({ x: bitecs_1.Types.f32, y: bitecs_1.Types.f32, z: bitecs_1.Types.f32 });
exports.Fgrad = (0, bitecs_1.defineComponent)({ xx: bitecs_1.Types.f32, xy: bitecs_1.Types.f32, xz: bitecs_1.Types.f32, yx: bitecs_1.Types.f32, yy: bitecs_1.Types.f32, yz: bitecs_1.Types.f32, zx: bitecs_1.Types.f32, zy: bitecs_1.Types.f32, zz: bitecs_1.Types.f32 });
exports.MaterialId = (0, bitecs_1.defineComponent)({ id: bitecs_1.Types.ui16 });
