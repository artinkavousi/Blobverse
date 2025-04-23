"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSphGPGPU = initSphGPGPU;
exports.gpuBridgeSystem = gpuBridgeSystem;
exports.getVelocityTexture = getVelocityTexture;
exports.getGridResolution = getGridResolution;
const GPUComputationRenderer_js_1 = require("three/examples/jsm/misc/GPUComputationRenderer.js");
const three_1 = require("three");
const ecs_core_1 = require("@blobverse/ecs-core");
const components_1 = require("../components");
const pos_frag_raw_1 = __importDefault(require("./shaders/pos.frag?raw"));
const vel_frag_raw_1 = __importDefault(require("./shaders/vel.frag?raw"));
const density_frag_raw_1 = __importDefault(require("./shaders/density.frag?raw"));
const pressure_frag_raw_1 = __importDefault(require("./shaders/pressure.frag?raw"));
const ecs_core_zustand_1 = require("@blobverse/ecs-core-zustand");
// GPU bridge helpers
let _renderer;
let _gpuCompute;
let _posVar;
let _velVar;
let _denVar;
let _preVar;
let _numParticles;
let _gpuSize;
let _pixelBuffer;
// Initialize GPU-based SPH compute using Three.js GPUComputationRenderer
function initSphGPGPU(renderer, num, size = 128) {
    // setup GPU bridge state
    _renderer = renderer;
    _numParticles = num;
    _gpuSize = size;
    _pixelBuffer = new Float32Array(size * size * 4);
    const gpuCompute = new GPUComputationRenderer_js_1.GPUComputationRenderer(size, size, renderer);
    _gpuCompute = gpuCompute;
    // Data textures for positions and velocities
    const pos0 = new three_1.DataTexture(new Float32Array(size * size * 4), size, size, three_1.RGBAFormat, three_1.FloatType);
    const vel0 = new three_1.DataTexture(new Float32Array(size * size * 4), size, size, three_1.RGBAFormat, three_1.FloatType);
    // seed initial buffers from ECS
    const posArr = pos0.image.data;
    const velArr = vel0.image.data;
    for (let i = 0; i < num; i++) {
        const off = i * 4;
        posArr[off] = components_1.Position.x[i];
        posArr[off + 1] = components_1.Position.y[i];
        posArr[off + 2] = components_1.Position.z[i];
        velArr[off] = components_1.Velocity.x[i];
        velArr[off + 1] = components_1.Velocity.y[i];
        velArr[off + 2] = components_1.Velocity.z[i];
        // leave w component unused
    }
    pos0.needsUpdate = true;
    vel0.needsUpdate = true;
    // Data textures for density and pressure
    const den0 = new three_1.DataTexture(new Float32Array(size * size * 4), size, size, three_1.RGBAFormat, three_1.FloatType);
    const pre0 = new three_1.DataTexture(new Float32Array(size * size * 4), size, size, three_1.RGBAFormat, three_1.FloatType);
    den0.needsUpdate = true;
    pre0.needsUpdate = true;
    const posVar = gpuCompute.addVariable('texturePosition', pos_frag_raw_1.default, pos0);
    const velVar = gpuCompute.addVariable('textureVelocity', vel_frag_raw_1.default, vel0);
    const denVar = gpuCompute.addVariable('textureDensity', density_frag_raw_1.default, den0);
    const preVar = gpuCompute.addVariable('texturePressure', pressure_frag_raw_1.default, pre0);
    _posVar = posVar;
    _velVar = velVar;
    _denVar = denVar;
    _preVar = preVar;
    // Set dependencies: density depends on position
    gpuCompute.setVariableDependencies(denVar, [posVar]);
    // pressure depends on position and density
    gpuCompute.setVariableDependencies(preVar, [posVar, denVar]);
    // velocity update depends on position, previous velocity, and pressure
    gpuCompute.setVariableDependencies(velVar, [posVar, velVar, preVar]);
    // position update depends on position and updated velocity
    gpuCompute.setVariableDependencies(posVar, [posVar, velVar]);
    gpuCompute.init();
    return gpuCompute;
}
// Bridge GPU positions back into ECS Position components each frame
function gpuBridgeSystem() {
    if (!_gpuCompute)
        return;
    // update shader uniforms from UI store
    const { h, restDensity, k, mu, g, dt } = ecs_core_zustand_1.useStore.getState();
    // position update uniforms
    _posVar.material.uniforms.dt.value = dt;
    // density pass uniforms
    _denVar.material.uniforms.h.value = h;
    _denVar.material.uniforms.restDensity.value = restDensity;
    // pressure pass uniforms
    _preVar.material.uniforms.k.value = k;
    _preVar.material.uniforms.restDensity.value = restDensity;
    // velocity pass uniforms
    _velVar.material.uniforms.h.value = h;
    _velVar.material.uniforms.mu.value = mu;
    _velVar.material.uniforms.dt.value = dt;
    _velVar.material.uniforms.g.value = g;
    _gpuCompute.compute();
    const rt = _gpuCompute.getCurrentRenderTarget(_posVar);
    _renderer.readRenderTargetPixels(rt, 0, 0, _gpuSize, _gpuSize, _pixelBuffer);
    for (let i = 0; i < _numParticles; i++) {
        const off = i * 4;
        components_1.Position.x[i] = _pixelBuffer[off];
        components_1.Position.y[i] = _pixelBuffer[off + 1];
        components_1.Position.z[i] = _pixelBuffer[off + 2];
    }
}
(0, ecs_core_1.register)(gpuBridgeSystem);
// expose SPH velocity texture for advecting RD chemicals
function getVelocityTexture() {
    if (!_gpuCompute)
        throw new Error('GPU compute not initialized');
    return _gpuCompute.getCurrentRenderTarget(_velVar).texture;
}
// expose grid resolution for advect shader
function getGridResolution() {
    return new three_1.Vector2(_gpuSize, _gpuSize);
}
