import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';
import { WebGLRenderer, Texture, Vector2 } from 'three';
export declare function initSphGPGPU(renderer: WebGLRenderer, num: number, size?: number): GPUComputationRenderer;
export declare function gpuBridgeSystem(): void;
export declare function getVelocityTexture(): Texture;
export declare function getGridResolution(): Vector2;
