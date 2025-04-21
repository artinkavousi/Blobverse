import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';
import { WebGLRenderer, DataTexture, RGBAFormat, FloatType } from 'three';
import { register } from '@blobverse/ecs-core';
import { Position } from '../components';
import posFrag from './shaders/pos.frag?raw';
import velFrag from './shaders/vel.frag?raw';

// GPU bridge helpers
let _renderer: WebGLRenderer;
let _gpuCompute: GPUComputationRenderer;
let _posVar: any;
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
  pos0.needsUpdate = true;
  vel0.needsUpdate = true;

  const posVar = gpuCompute.addVariable('texturePosition', posFrag, pos0);
  const velVar = gpuCompute.addVariable('textureVelocity', velFrag, vel0);
  _posVar = posVar;

  gpuCompute.setVariableDependencies(posVar, [posVar, velVar]);
  gpuCompute.setVariableDependencies(velVar, [posVar, velVar]);

  gpuCompute.init();
  return gpuCompute;
}

// Bridge GPU positions back into ECS Position components each frame
export function gpuBridgeSystem() {
  if (!_gpuCompute) return;
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