import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useControls } from 'leva';
import { useStore } from '@blobverse/ecs-core-zustand';
import '@blobverse/physics-sph';
import { initSphGPGPU } from '@blobverse/physics-sph';
import { enableSystem, disableSystem } from '@blobverse/ecs-core';
import { SphSystem } from '@blobverse/physics-sph';
import { MpmSystem } from '@blobverse/physics-mpm';
import { Runner } from './Runner';
import { RayMarchMesh } from './RayMarchMesh';
import { World, enableSystem } from '@blobverse/ecs-core';
import { RdSystem } from '@blobverse/field-rd';
import { ControlPanel } from './ControlPanel';

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

  // Simulation mode: 'sph' or 'mpm'
  const { mode } = useControls({ mode: { options: ['sph', 'mpm'] } });
  // Hot-swap systems
  useEffect(() => {
    if (mode === 'sph') {
      enableSystem(SphSystem);
      disableSystem(MpmSystem);
    } else {
      enableSystem(MpmSystem);
      disableSystem(SphSystem);
    }
  }, [mode]);

  // render metadata controls and R3F canvas
  return (
    <>
      <ControlPanel />
      <Canvas
        onCreated={({ gl }) => {
          // initialize SPH GPU compute
          initSphGPGPU(gl, 2048);
          // enable and initialize Reaction-Diffusion system
          enableSystem(RdSystem);
          RdSystem.instance.init(gl);
        }}
      >
        {/* Scene Systems execution */}
        <ambientLight />
        <directionalLight position={[0, 1, 1]} />
        <Runner />
        <RayMarchMesh />
      </Canvas>
    </>
  );
}
