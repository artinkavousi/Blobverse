#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uDist;          // jump‑flood SDF
uniform mat4 uInvProj;
uniform float iso;                // usually 0

varying vec2 vUv;

float distField(vec3 p) {
  vec2 uv = p.xy * 0.5 + 0.5;
  return texture2D(uDist, uv).r + p.z;   // treat red channel as height
}

void main() {
  vec3 ro = vec3((vUv*2.-1.), 1.5);      // camera origin (billboard ray)
  vec3 rd = normalize(vec3(0,0,-1));

  float t = 0.0;
  for(int i=0;i<64;i++){
    vec3 p = ro + t * rd;
    float d = distField(p) - iso;
    if (d < 0.001) { break; }
    t += d;                               // sphere‑tracing
    if (t>3.0) discard;
  }
  gl_FragColor = vec4(0.5,0.9,1.0,1.0);
} 