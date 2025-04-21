import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';
import { WebGLRenderer, DataTexture, RGBAFormat, FloatType } from 'three';
import { register } from '@blobverse/ecs-core';
import { Position, Velocity } from '../components';
import posFrag from './shaders/pos.frag?raw';
import velFrag from './shaders/vel.frag?raw';
import densityFrag from './shaders/density.frag?raw';
import pressureFrag from './shaders/pressure.frag?raw';
import { useStore } from '@blobverse/ecs-core-zustand';

// GPU bridge helpers
let _renderer: WebGLRenderer;
let _gpuCompute: GPUComputationRenderer;
let _posVar: any;
let _velVar: any;
let _denVar: any;
let _preVar: any;
let _numParticles: number;
let _gpuSize: number;
let _pixelBuffer: Float32Array;

// Initialize GPU-based SPH compute using Three.js GPUComputationRenderer
export function initSphGPGPU(renderer: WebGLRenderer, num: number, size = 128) {
  // setup GPU bridge state
  _renderer = renderer;
  _numParticles = num;
  _gpuSize = size;
  _pixelBuffer = new Float32Array(size * size * 4);

  const gpuCompute = new GPUComputationRenderer(size, size, renderer);
  _gpuCompute = gpuCompute;

  // Data textures for positions and velocities
  const pos0 = new DataTexture(new Float32Array(size * size * 4), size, size, RGBAFormat, FloatType);
  const vel0 = new DataTexture(new Float32Array(size * size * 4), size, size, RGBAFormat, FloatType);
  // seed initial buffers from ECS
  const posArr = pos0.image.data as Float32Array;
  const velArr = vel0.image.data as Float32Array;
  for (let i = 0; i < num; i++) {
    const off = i * 4;
    posArr[off]     = Position.x[i];
    posArr[off + 1] = Position.y[i];
    posArr[off + 2] = Position.z[i];
    velArr[off]     = Velocity.x[i];
    velArr[off + 1] = Velocity.y[i];
    velArr[off + 2] = Velocity.z[i];
    // leave w component unused
  }
  pos0.needsUpdate = true;
  vel0.needsUpdate = true;

  // Data textures for density and pressure
  const den0 = new DataTexture(new Float32Array(size * size * 4), size, size, RGBAFormat, FloatType);
  const pre0 = new DataTexture(new Float32Array(size * size * 4), size, size, RGBAFormat, FloatType);
  den0.needsUpdate = true;
  pre0.needsUpdate = true;

  const posVar = gpuCompute.addVariable('texturePosition', posFrag, pos0);
  const velVar = gpuCompute.addVariable('textureVelocity', velFrag, vel0);
  const denVar = gpuCompute.addVariable('textureDensity', densityFrag, den0);
  const preVar = gpuCompute.addVariable('texturePressure', pressureFrag, pre0);

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
export function gpuBridgeSystem() {
  if (!_gpuCompute) return;

  // update shader uniforms from UI store
  const { h, restDensity, k, mu, g, dt } = useStore.getState();
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
    Position.x[i] = _pixelBuffer[off];
    Position.y[i] = _pixelBuffer[off + 1];
    Position.z[i] = _pixelBuffer[off + 2];
  }
}

register(gpuBridgeSystem); 