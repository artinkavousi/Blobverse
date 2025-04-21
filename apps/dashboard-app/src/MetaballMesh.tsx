import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes.js';
import { World } from '@blobverse/ecs-core';
import { Position } from '@blobverse/physics-sph';

export function MetaballMesh({ world, resolution = 32, ballSize = 0.05, isolation = 12 }) {
  const { scene } = useThree();
  const mc = useRef<MarchingCubes>();

  useEffect(() => {
    const material = new THREE.MeshStandardMaterial({
      color: '#7fd7ff',
      metalness: 0.1,
      roughness: 0.25,
    });
    const mesh = new MarchingCubes(resolution, material, true, true);
    mesh.position.set(0, 0.15, 0);
    mesh.scale.set(0.5, 0.5, 0.5);
    scene.add(mesh);
    mc.current = mesh;

    return () => {
      if (mc.current) {
        scene.remove(mc.current);
        mc.current.geometry.dispose();
        mc.current.material.dispose();
      }
    };
  }, [scene, resolution]);

  useFrame(() => {
    const mesh = mc.current;
    if (!mesh) return;
    mesh.reset();
    let count = 0;
    for (const eid of (world.query?.([Position]) ?? [])) {
      mesh.addBall(
        Position.x[eid],
        Position.y[eid],
        Position.z[eid],
        ballSize,
        isolation
      );
      if (++count >= world.size) break;
    }
  });

  return null;
} 