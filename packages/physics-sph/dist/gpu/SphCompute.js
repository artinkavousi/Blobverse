"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSphGPGPU = initSphGPGPU;
exports.gpuBridgeSystem = gpuBridgeSystem;
var GPUComputationRenderer_js_1 = require("three/examples/jsm/misc/GPUComputationRenderer.js");
var three_1 = require("three");
var ecs_core_1 = require("@blobverse/ecs-core");
var components_1 = require("../components");
var pos_frag_raw_1 = require("./shaders/pos.frag?raw");
var vel_frag_raw_1 = require("./shaders/vel.frag?raw");
// GPU bridge helpers
var _renderer;
var _gpuCompute;
var _posVar;
var _numParticles;
var _gpuSize;
var _pixelBuffer;
// Initialize GPU-based SPH compute using Three.js GPUComputationRenderer
function initSphGPGPU(renderer, num, size) {
    if (size === void 0) { size = 128; }
    // setup GPU bridge state
    _renderer = renderer;
    _numParticles = num;
    _gpuSize = size;
    _pixelBuffer = new Float32Array(size * size * 4);
    var gpuCompute = new GPUComputationRenderer_js_1.GPUComputationRenderer(size, size, renderer);
    _gpuCompute = gpuCompute;
    // Data textures for positions and velocities
    var pos0 = new three_1.DataTexture(new Float32Array(size * size * 4), size, size, three_1.RGBAFormat, three_1.FloatType);
    var vel0 = new three_1.DataTexture(new Float32Array(size * size * 4), size, size, three_1.RGBAFormat, three_1.FloatType);
    pos0.needsUpdate = true;
    vel0.needsUpdate = true;
    var posVar = gpuCompute.addVariable('texturePosition', pos_frag_raw_1.default, pos0);
    var velVar = gpuCompute.addVariable('textureVelocity', vel_frag_raw_1.default, vel0);
    _posVar = posVar;
    gpuCompute.setVariableDependencies(posVar, [posVar, velVar]);
    gpuCompute.setVariableDependencies(velVar, [posVar, velVar]);
    gpuCompute.init();
    return gpuCompute;
}
// Bridge GPU positions back into ECS Position components each frame
function gpuBridgeSystem() {
    if (!_gpuCompute)
        return;
    _gpuCompute.compute();
    var rt = _gpuCompute.getCurrentRenderTarget(_posVar);
    _renderer.readRenderTargetPixels(rt, 0, 0, _gpuSize, _gpuSize, _pixelBuffer);
    for (var i = 0; i < _numParticles; i++) {
        var off = i * 4;
        components_1.Position.x[i] = _pixelBuffer[off];
        components_1.Position.y[i] = _pixelBuffer[off + 1];
        components_1.Position.z[i] = _pixelBuffer[off + 2];
    }
}
(0, ecs_core_1.register)(gpuBridgeSystem);
