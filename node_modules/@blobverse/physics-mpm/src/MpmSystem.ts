import { registerComputePipeline } from '@blobverse/ecs-core/gpu';
import mpmP2G from './gpu/mpm-p2g.wgsl?raw';
import mpmGrid from './gpu/mpm-grid.wgsl?raw';
import mpmG2P from './gpu/mpm-g2p.wgsl?raw';
import { register } from '@blobverse/ecs-core';

export class MpmSystem {
  constructor() {
    registerComputePipeline('mpm-p2g', mpmP2G, { workgroup: 128 });
    registerComputePipeline('mpm-grid', mpmGrid, { workgroup: [8,8,1] });
    registerComputePipeline('mpm-g2p', mpmG2P, { workgroup: 128 });
  }
  execute() {
    /* nothing – compute passes scheduled by engine */
  }
}

// auto-register the MpmSystem
register(MpmSystem); 