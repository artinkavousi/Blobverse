import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useControls } from 'leva';
import { useStore } from '@blobverse/ecs-core-zustand';
import '@blobverse/physics-sph';
import { initSphGPGPU } from '@blobverse/physics-sph';
import { Particles } from './Particles';
import { World } from '@blobverse/ecs-core';
import { ControlPanel } from './ControlPanel';
import { MetaballMesh } from './MetaballMesh';

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

  // render metadata controls and R3F canvas
  return (
    <>
      <ControlPanel />
      <Canvas onCreated={({ gl }) => initSphGPGPU(gl, 2048)}>
        {/* Scene Systems will execute SPH simulation systems */}
        {/* Uncomment below to visualize points */}
        {/* <Particles world={World} /> */}
        {/* Metaball mesh surface */}
        <MetaballMesh world={World} />
      </Canvas>
    </>
  );
}
