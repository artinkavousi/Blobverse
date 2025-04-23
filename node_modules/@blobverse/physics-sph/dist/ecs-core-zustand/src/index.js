"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStore = void 0;
const zustand_1 = __importDefault(require("zustand"));
exports.useStore = (0, zustand_1.default)(() => ({
    h: 0.04,
    restDensity: 1000,
    k: 4,
    mu: 0.1,
    g: 9.81,
    dt: 0.016,
    // MPM defaults
    youngModulus: 400,
    poissonRatio: 0.2,
    yield: 2,
    plasticHardening: 10,
    planeHeight: -0.02,
    boxSize: 0.05,
    boxY: 0.15,
}));
