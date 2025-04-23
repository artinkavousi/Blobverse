precision highp float;
uniform sampler2D texAB;  // RG: A,B
uniform vec2 resolution;
uniform float feed, kill, diffA, diffB, dt;
varying vec2 vUv;

float laplacian(vec2 uv, int channel) {
  vec2 off = 1.0 / resolution;
  float sum = 0.0;
  if (channel == 0) {
    sum += texture2D(texAB, uv + vec2(-off.x, 0)).r;
    sum += texture2D(texAB, uv + vec2(off.x, 0)).r;
    sum += texture2D(texAB, uv + vec2(0, -off.y)).r;
    sum += texture2D(texAB, uv + vec2(0, off.y)).r;
    sum -= 4.0 * texture2D(texAB, uv).r;
  } else {
    sum += texture2D(texAB, uv + vec2(-off.x, 0)).g;
    sum += texture2D(texAB, uv + vec2(off.x, 0)).g;
    sum += texture2D(texAB, uv + vec2(0, -off.y)).g;
    sum += texture2D(texAB, uv + vec2(0, off.y)).g;
    sum -= 4.0 * texture2D(texAB, uv).g;
  }
  return sum;
}

void main() {
  vec2 ab = texture2D(texAB, vUv).rg;
  float A = ab.r;
  float B = ab.g;
  float lapA = laplacian(vUv, 0);
  float lapB = laplacian(vUv, 1);
  float dA = diffA * lapA - A * B * B + feed * (1.0 - A);
  float dB = diffB * lapB + A * B * B - (kill + feed) * B;
  A += dA * dt;
  B += dB * dt;
  gl_FragColor = vec4(A, B, 0.0, 1.0);
} 