precision highp float;
uniform sampler2D texAB;       // RG: A,B
uniform sampler2D velocityTex; // velocity texture from SPH
uniform vec2 resolution;
uniform float dt;
varying vec2 vUv;

void main() {
  // sample velocity (assumes RG channels hold velocity.xy)
  vec2 vel = texture2D(velocityTex, vUv).rg;
  // compute offset in texture space
  vec2 off = vel * dt / resolution;
  vec2 uv0 = vUv - off;
  // sample chemical concentrations at upstream position
  vec2 ab = texture2D(texAB, uv0).rg;
  gl_FragColor = vec4(ab, 0.0, 1.0);
} 