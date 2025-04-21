precision highp float;
const float PI = 3.141592653589793;

uniform sampler2D textureVelocity;
uniform sampler2D texturePosition;
uniform sampler2D textureDensity;
uniform sampler2D texturePressure;
uniform float h;
uniform float mu;
uniform float dt;
uniform float g;
uniform vec2 resolution;

// Spiky gradient kernel magnitude
float spiky_grad(float r, float h) { return -45.0/(PI*pow(h,6.0))*pow(h-r,2.0); }
// Viscosity laplacian kernel
float visc_laplace(float r, float h) { return 45.0/(PI*pow(h,6.0))*(h-r); }

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  vec3 pos = texture2D(texturePosition, uv).xyz;
  vec3 vel_i = texture2D(textureVelocity, uv).xyz;
  float rho_i = texture2D(textureDensity, uv).r;
  float P_i = texture2D(texturePressure, uv).r;
  vec3 f = vec3(0.0);
  // gravity
  f.y -= g * rho_i;
  
  // neighbor loops
  for (int dx = -1; dx <= 1; dx++) {
    for (int dy = -1; dy <= 1; dy++) {
      vec2 off = vec2(dx, dy) / resolution;
      vec3 pos_j = texture2D(texturePosition, uv + off).xyz;
      float r = length(pos - pos_j);
      if (r < h && r > 0.0) {
        float P_j = texture2D(texturePressure, uv + off).r;
        float rho_j = texture2D(textureDensity, uv + off).r;
        float grad = spiky_grad(r, h);
        vec3 rVec = pos - pos_j;
        // pressure force
        f += -(P_i + P_j) / (2.0 * rho_j) * grad * rVec;
        // viscosity force
        vec3 vel_j = texture2D(textureVelocity, uv + off).xyz;
        float lap = visc_laplace(r, h);
        f += mu * lap * (vel_j - vel_i);
      }
    }
  }
  // integrate acceleration
  vec3 vel_new = vel_i + (f / rho_i) * dt;
  gl_FragColor = vec4(vel_new, 1.0);
} 