import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';
import { WebGLRenderer, Vector2 } from 'three';
import { register } from '@blobverse/ecs-core';
import { getVelocityTexture, getGridResolution } from '@blobverse/physics-sph';
import { useStore } from '@blobverse/ecs-core-zustand';
import initFrag from './gpu/rd-init.frag?raw';
import updateFrag from './gpu/rd-update.frag?raw';
import advectFrag from './gpu/rd-advect.frag?raw';

export class RdSystem {
  static instance: RdSystem;
  private gpu: GPUComputationRenderer | null = null;
  private varUpdate: any;
  private varAdvect: any;
  private width: number;

  constructor(width = 256) {
    RdSystem.instance = this;
    this.width = width;
  }

  init(renderer: WebGLRenderer): void {
    if (this.gpu) return;
    this.gpu = new GPUComputationRenderer(this.width, this.width, renderer);
    const tex0 = this.gpu.createTexture();
    this.gpu.renderTexture(initFrag, tex0);
    const tex1 = this.gpu.createTexture();
    this.varUpdate = this.gpu.addVariable('texAB', updateFrag, tex0);
    this.varAdvect = this.gpu.addVariable('texAB', advectFrag, tex1);
    this.gpu.setVariableDependencies(this.varUpdate, [this.varUpdate]);
    this.gpu.setVariableDependencies(this.varAdvect, [this.varUpdate]);

    // set resolution uniform for update and advect shaders
    const res = new Vector2(this.width, this.width);
    this.varUpdate.material.uniforms.resolution = { value: res };
    this.varAdvect.material.uniforms.resolution = { value: getGridResolution() };

    // set velocity texture uniform for advect shader
    this.varAdvect.material.uniforms.velocityTex = { value: getVelocityTexture() };

    this.gpu.init();
  }

  execute(world: any): void {
    if (!this.gpu) return;
    // Reaction-Diffusion control values from store
    const { feed, kill, diffA, diffB, rdDt } = useStore.getState();
    const u = this.varUpdate.material.uniforms;
    u.feed.value = feed;
    u.kill.value = kill;
    u.diffA.value = diffA;
    u.diffB.value = diffB;
    u.dt.value = rdDt;
    // update advect dt
    this.varAdvect.material.uniforms.dt.value = rdDt;
    this.gpu.compute();
    // swap ping-pong variables
    [this.varUpdate, this.varAdvect] = [this.varAdvect, this.varUpdate];
  }

  get texture() {
    return this.gpu?.getCurrentRenderTarget(this.varUpdate).texture!;
  }
}

register(RdSystem); 