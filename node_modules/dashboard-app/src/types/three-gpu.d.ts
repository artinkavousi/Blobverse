// Create module declaration for GPUComputationRenderer
declare module 'three/examples/jsm/misc/GPUComputationRenderer.js' {
  import { WebGLRenderer, DataTexture } from 'three';
  export class GPUComputationRenderer {
    constructor(x: number, y: number, renderer: WebGLRenderer);
    addVariable(name: string, fragmentShader: string, initialValueTexture: DataTexture): any;
    setVariableDependencies(variable: any, deps: any[]): void;
    init(): void;
    compute(): void;
    getCurrentRenderTarget(v: any): any;
  }
} 