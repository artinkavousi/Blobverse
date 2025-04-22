#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uDist;          // jump-flood SDF
uniform sampler2D uRD;            // reaction-diffusion B channel
uniform mat4 uInvProj;
uniform float iso;                // usually 0

varying vec2 vUv;

float distField(vec3 p) {
  vec2 uv = p.xy * 0.5 + 0.5;
  return texture2D(uDist, uv).r + p.z;   // treat red channel as height
}

void main() {
  // compute camera origin and ray direction
  vec2 uv2 = vUv * 2.0 - vec2(1.0);
  vec3 ro = vec3(uv2, 1.5);
  vec3 rd = normalize(vec3(0.0, 0.0, -1.0));

  float t = 0.0;
  vec3 p;
  for(int i = 0; i < 64; i++) {
    p = ro + t * rd;
    float d = distField(p) - iso;
    if (d < 0.001) break;
    t += d;                               // sphere-tracing
    if (t > 3.0) discard;
  }

  // sample RD texture at hit point
  vec2 uvChem = p.xy * 0.5 + 0.5;
  float B = texture2D(uRD, uvChem).g;
  // map B to color
  vec3 col = mix(vec3(0.2,0.7,1.0), vec3(1.0,0.2,0.3), B);
  gl_FragColor = vec4(col, 1.0);
} 