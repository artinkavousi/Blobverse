import { createSDFGenerator } from 'gpu-distance-field';
import { World, register } from '@blobverse/ecs-core';
import { Position } from './components';

export class JumpFloodSdfSystem {
  static instance: JumpFloodSdfSystem;
  private sdf = createSDFGenerator({ width: 512, height: 512 });

  constructor() {
    JumpFloodSdfSystem.instance = this;
  }

  execute(world: World) {
    this.sdf.begin();
    for (const eid of world.query([Position])) {
      this.sdf.seed(Position.x[eid], Position.y[eid]);
    }
    this.sdf.compute();
  }

  // expose the SDF texture
  get texture() {
    return this.sdf.texture;
  }
}

register(JumpFloodSdfSystem); 