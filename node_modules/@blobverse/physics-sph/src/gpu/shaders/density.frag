precision highp float;
const float PI = 3.141592653589793;

uniform sampler2D texturePosition;
uniform float h;
uniform float restDensity;
uniform vec2 resolution;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  vec3 pos = texture2D(texturePosition, uv).xyz;

  float rho = 0.0;
  // 9-tap neighbourhood (cheap substitute for hash grid on GPU):
  for (int dx = -1; dx <= 1; dx++) {
    for (int dy = -1; dy <= 1; dy++) {
      vec2 off = vec2(dx, dy) / resolution;
      vec3 q = texture2D(texturePosition, uv + off).xyz;
      float r = length(pos - q);
      if (r < h) {
        float coeff = 315.0 * pow(h * h - r * r, 3.0) / (64.0 * PI * pow(h, 9.0));
        rho += coeff;
      }
    }
  }

  gl_FragColor = vec4(rho, 0.0, 0.0, 1.0);
} 