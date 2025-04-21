"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultParams = exports.SphSystem = void 0;
var ecs_core_1 = require("@blobverse/ecs-core");
var components_1 = require("./components");
var spatial_hash_1 = require("./spatial-hash");
var math_1 = require("./math");
/**
 * Simple CPU‑side SPH prototype.
 *   – good for debugging    👓
 *   – will be replaced by GPU compute in Milestone 3
 */
var SphSystem = /** @class */ (function () {
    function SphSystem(params) {
        if (params === void 0) { params = {}; }
        this.params = params;
    }
    SphSystem.prototype.execute = function (world) {
        var _a = __assign(__assign({}, exports.defaultParams), this.params), h = _a.h, restDensity = _a.restDensity, k = _a.k, mu = _a.mu, g = _a.g, dt = _a.dt;
        // 1. build neighbour grid
        var grid = (0, spatial_hash_1.createUniformGrid)(world, h);
        var _loop_1 = function (eid) {
            var rho = 0;
            (0, spatial_hash_1.neighbours)(eid, grid, h, function (j) {
                if (j === eid)
                    return;
                var rVec = {
                    x: components_1.Position.x[eid] - components_1.Position.x[j],
                    y: components_1.Position.y[eid] - components_1.Position.y[j],
                    z: components_1.Position.z[eid] - components_1.Position.z[j],
                };
                var r = (0, math_1.length)(rVec);
                rho += (0, math_1.poly6)(r, h);
            });
            components_1.Fluid.density[eid] = rho;
            components_1.Fluid.pressure[eid] = k * (rho - restDensity);
        };
        // 2. density & pressure
        for (var _i = 0, _b = world.query([components_1.Position, components_1.Fluid]); _i < _b.length; _i++) {
            var eid = _b[_i];
            _loop_1(eid);
        }
        var _loop_2 = function (eid) {
            var fX = 0, fY = -g, fZ = 0;
            (0, spatial_hash_1.neighbours)(eid, grid, h, function (j) {
                if (j === eid)
                    return;
                var rVec = {
                    x: components_1.Position.x[eid] - components_1.Position.x[j],
                    y: components_1.Position.y[eid] - components_1.Position.y[j],
                    z: components_1.Position.z[eid] - components_1.Position.z[j],
                };
                var r = (0, math_1.length)(rVec);
                // pressure
                var pTerm = -(components_1.Fluid.pressure[eid] + components_1.Fluid.pressure[j]) / (2 * components_1.Fluid.density[j]);
                var grad = (0, math_1.spikyGrad)(r, h);
                fX += pTerm * grad * rVec.x;
                fY += pTerm * grad * rVec.y;
                fZ += pTerm * grad * rVec.z;
                // viscosity
                var uij = {
                    x: components_1.Velocity.x[j] - components_1.Velocity.x[eid],
                    y: components_1.Velocity.y[j] - components_1.Velocity.y[eid],
                    z: components_1.Velocity.z[j] - components_1.Velocity.z[eid],
                };
                var visc = mu * (0, math_1.viscLaplace)(r, h);
                fX += visc * uij.x;
                fY += visc * uij.y;
                fZ += visc * uij.z;
            });
            // integrate (semi-implicit Euler)
            components_1.Velocity.x[eid] += fX * dt;
            components_1.Velocity.y[eid] += fY * dt;
            components_1.Velocity.z[eid] += fZ * dt;
            components_1.Position.x[eid] += components_1.Velocity.x[eid] * dt;
            components_1.Position.y[eid] += components_1.Velocity.y[eid] * dt;
            components_1.Position.z[eid] += components_1.Velocity.z[eid] * dt;
        };
        // 3. forces
        for (var _c = 0, _d = world.query([components_1.Position, components_1.Velocity, components_1.Fluid]); _c < _d.length; _c++) {
            var eid = _d[_c];
            _loop_2(eid);
        }
    };
    return SphSystem;
}());
exports.SphSystem = SphSystem;
exports.defaultParams = {
    h: 0.04,
    restDensity: 1000,
    k: 4,
    mu: 0.1,
    g: 9.81,
    dt: 0.016,
};
// auto-register
(0, ecs_core_1.register)(SphSystem);
