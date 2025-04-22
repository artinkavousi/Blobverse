precision highp float;
varying vec2 vUv;

void main() {
  // A=1 everywhere, B=0 except seed spot
  float A = 1.0;
  float B = (length(vUv - 0.5) < 0.05) ? 1.0 : 0.0;
  gl_FragColor = vec4(A, B, 0.0, 1.0);
} 