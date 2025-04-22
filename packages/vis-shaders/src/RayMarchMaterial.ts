import { ShaderMaterial, Matrix4, Texture } from 'three';
import sdRaymarchFrag from './shaders/raymarch.frag?raw';

export const RayMarchMaterial = (distTex: Texture) =>
  new ShaderMaterial({
    uniforms: {
      uDist: { value: distTex },
      uInvProj: { value: new Matrix4() },
      iso: { value: 0.0 }
    },
    vertexShader: /* glsl */`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position,1.);
      }
    `,
    fragmentShader: sdRaymarchFrag,
    transparent: true
  }); 