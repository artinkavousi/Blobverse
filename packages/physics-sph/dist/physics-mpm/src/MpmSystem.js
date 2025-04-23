"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MpmSystem = void 0;
const gpu_1 = require("@blobverse/ecs-core/gpu");
const mpm_p2g_wgsl_raw_1 = __importDefault(require("./gpu/mpm-p2g.wgsl?raw"));
const mpm_grid_wgsl_raw_1 = __importDefault(require("./gpu/mpm-grid.wgsl?raw"));
const mpm_g2p_wgsl_raw_1 = __importDefault(require("./gpu/mpm-g2p.wgsl?raw"));
const ecs_core_1 = require("@blobverse/ecs-core");
class MpmSystem {
    constructor() {
        (0, gpu_1.registerComputePipeline)('mpm-p2g', mpm_p2g_wgsl_raw_1.default, { workgroup: 128 });
        (0, gpu_1.registerComputePipeline)('mpm-grid', mpm_grid_wgsl_raw_1.default, { workgroup: [8, 8, 1] });
        (0, gpu_1.registerComputePipeline)('mpm-g2p', mpm_g2p_wgsl_raw_1.default, { workgroup: 128 });
    }
    execute() {
        /* nothing – compute passes scheduled by engine */
    }
}
exports.MpmSystem = MpmSystem;
// auto-register the MpmSystem
(0, ecs_core_1.register)(MpmSystem);
