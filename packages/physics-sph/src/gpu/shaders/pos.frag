precision highp float;
uniform sampler2D texturePosition;
uniform vec2 resolution;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  vec4 pos = texture2D(texturePosition, uv);
  pos.y -= 9.81 * 0.016;      // simple gravity
  gl_FragColor = pos;
} 