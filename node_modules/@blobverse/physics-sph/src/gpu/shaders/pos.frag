precision highp float;
uniform sampler2D texturePosition;
uniform sampler2D textureVelocity;
uniform vec2 resolution;
uniform float dt;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  vec3 pos = texture2D(texturePosition, uv).xyz;
  vec3 vel = texture2D(textureVelocity, uv).xyz;
  // integrate velocity
  pos += vel * dt;
  gl_FragColor = vec4(pos, 1.0);
} 