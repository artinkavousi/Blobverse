import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useControls } from 'leva';
import { useStore } from '@blobverse/ecs-core-zustand';
import '@blobverse/physics-sph';
import { Particles } from './Particles';
import { World } from '@blobverse/ecs-core';

export default function App() {
  // SPH parameters in Leva panel
  const { h, restDensity, k, mu, g, dt } = useControls({
    h: 0.04,
    restDensity: 1000,
    k: 4,
    mu: 0.1,
    g: 9.81,
    dt: 0.016
  });
  // update global ECS store
  useStore.setState({ h, restDensity, k, mu, g, dt });

  // render R3F canvas
  return (
    <Canvas>
      {/* Scene Systems will execute SPH simulation systems */}
      <Particles world={World} />
    </Canvas>
  );
}
