import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { JumpFloodSdfSystem } from '@blobverse/physics-sph';
import { RayMarchMaterial } from '@blobverse/vis-shaders';
import type { ShaderMaterial } from 'three';

export function RayMarchMesh() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const matRef = useRef<ShaderMaterial>();

  useEffect(() => {
    const sdfSys = JumpFloodSdfSystem.instance;
    if (meshRef.current && sdfSys) {
      matRef.current = RayMarchMaterial(sdfSys.texture);
      meshRef.current.material = matRef.current;
    }
  }, []);

  useFrame(() => {
    const mat = matRef.current;
    const sdfSys = JumpFloodSdfSystem.instance;
    if (mat && sdfSys) {
      mat.uniforms.uDist.value = sdfSys.texture;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
} 