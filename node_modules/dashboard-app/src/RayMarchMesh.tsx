import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { JumpFloodSdfSystem } from '@blobverse/physics-sph';
import { RayMarchMaterial } from '@blobverse/vis-shaders';
import type { ShaderMaterial } from 'three';
import { RdSystem } from '@blobverse/field-rd';

export function RayMarchMesh() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const matRef = useRef<ShaderMaterial>();

  useEffect(() => {
    const sdfSys = JumpFloodSdfSystem.instance;
    const rdSys = RdSystem.instance;
    if (meshRef.current && sdfSys && rdSys) {
      matRef.current = RayMarchMaterial(sdfSys.texture, rdSys.texture);
      meshRef.current.material = matRef.current;
    }
  }, []);

  useFrame(() => {
    const mat = matRef.current;
    const sdfSys = JumpFloodSdfSystem.instance;
    const rdSys = RdSystem.instance;
    if (mat && sdfSys && rdSys) {
      mat.uniforms.uDist.value = sdfSys.texture;
      mat.uniforms.uRD.value = rdSys.texture;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
} 