import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';
import { WebGLRenderer, DataTexture, RGBAFormat, FloatType } from 'three';

// Initialize GPU-based SPH compute using Three.js GPUComputationRenderer
export function initSphGPGPU(renderer: WebGLRenderer, num: number, size = 128) {
  const gpuCompute = new GPUComputationRenderer(size, size, renderer);

  // Data textures for positions and velocities
  const pos0 = new DataTexture(new Float32Array(size * size * 4), size, size, RGBAFormat, FloatType);
  const vel0 = new DataTexture(new Float32Array(size * size * 4), size, size, RGBAFormat, FloatType);
  pos0.needsUpdate = true;
  vel0.needsUpdate = true;

  // Simple GLSL shaders for position and velocity updates
  const positionFragmentShader = `
    uniform sampler2D texturePosition;
    uniform sampler2D textureVelocity;
    uniform vec2 resolution;

    void main() {
      vec2 uv = gl_FragCoord.xy / resolution;
      vec4 pos = texture2D(texturePosition, uv);
      vec4 vel = texture2D(textureVelocity, uv);
      pos.xyz += vel.xyz * 0.016;
      gl_FragColor = pos;
    }
  `;

  const velocityFragmentShader = `
    uniform sampler2D texturePosition;
    uniform sampler2D textureVelocity;
    uniform vec2 resolution;

    void main() {
      vec2 uv = gl_FragCoord.xy / resolution;
      vec4 pos = texture2D(texturePosition, uv);
      vec4 vel = texture2D(textureVelocity, uv);
      vel.y -= 9.81 * 0.016;
      gl_FragColor = vel;
    }
  `;

  const posVar = gpuCompute.addVariable('texturePosition', positionFragmentShader, pos0);
  const velVar = gpuCompute.addVariable('textureVelocity', velocityFragmentShader, vel0);

  gpuCompute.setVariableDependencies(posVar, [posVar, velVar]);
  gpuCompute.setVariableDependencies(velVar, [posVar, velVar]);

  gpuCompute.init();
  return gpuCompute;
} 