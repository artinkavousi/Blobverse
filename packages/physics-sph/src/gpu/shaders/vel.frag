precision highp float;
uniform sampler2D textureVelocity;
uniform vec2 resolution;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  vec4 vel = texture2D(textureVelocity, uv);
  gl_FragColor = vel;
} 