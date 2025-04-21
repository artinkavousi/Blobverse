import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useControls } from 'leva';
import '@blobverse/physics-sph';
import { spawnParticles, initSphGPGPU, Position, World } from '@blobverse/physics-sph';
import * as THREE from 'three';
import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes.js';

export default { title: 'SPH/GPU Metaball Demo' };

const Metaball = ({ resolution = 32, ballSize = 0.05, isolation = 12 }) => {
  const mc = useRef<MarchingCubes>();
  const { scene } = useThree();
  useEffect(() => {
    const material = new THREE.MeshStandardMaterial({ color: '#7fd7ff', metalness: 0.1, roughness: 0.25 });
    const mesh = new MarchingCubes(resolution, material, true, true);
    mesh.position.set(0, 0.15, 0);
    mesh.scale.set(0.5, 0.5, 0.5);
    scene.add(mesh);
    mc.current = mesh;
    return () => {
      scene.remove(mesh);
      mesh.geometry.dispose();
      mesh.material.dispose();
    };
  }, [scene, resolution]);
  useFrame(() => {
    const mesh = mc.current;
    if (!mesh) return;
    mesh.reset();
    for (const eid of World.query([Position])) {
      mesh.addBall(Position.x[eid], Position.y[eid], Position.z[eid], ballSize, isolation);
    }
  });
  return null;
};

export const SPHGPUAlpha = () => {
  const { nParticles } = useControls('SPH Demo', { nParticles: { value: 2048, min: 128, max: 8192, step: 128 } });
  useEffect(() => { spawnParticles(nParticles); }, [nParticles]);
  return (
    <Canvas onCreated={({ gl }) => initSphGPGPU(gl, nParticles)}>
      <ambientLight />
      <directionalLight position={[0, 1, 1]} />
      <Metaball />
    </Canvas>
  );
};
