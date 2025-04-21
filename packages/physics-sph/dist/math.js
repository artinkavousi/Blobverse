"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.viscLaplace = exports.spikyGrad = exports.poly6 = exports.length = void 0;
var length = function (v) {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
};
exports.length = length;
// Poly‑6 density kernel
var poly6 = function (r, h) {
    return r >= 0 && r <= h
        ? (315 / (64 * Math.PI * Math.pow(h, 9))) *
            Math.pow(h * h - r * r, 3)
        : 0;
};
exports.poly6 = poly6;
// Spiky pressure‑gradient kernel
var spikyGrad = function (r, h) {
    return r > 0 && r <= h
        ? (-45 / (Math.PI * Math.pow(h, 6))) * Math.pow(h - r, 2)
        : 0;
};
exports.spikyGrad = spikyGrad;
// Viscosity Laplacian
var viscLaplace = function (r, h) {
    return r >= 0 && r <= h
        ? (45 / (Math.PI * Math.pow(h, 6))) * (h - r)
        : 0;
};
exports.viscLaplace = viscLaplace;
