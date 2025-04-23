precision highp float;

uniform sampler2D textureDensity;
uniform float k;
uniform float restDensity;
uniform vec2 resolution;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  float rho = texture2D(textureDensity, uv).r;
  float P = k * (rho - restDensity);
  gl_FragColor = vec4(P, 0.0, 0.0, 1.0);
} 