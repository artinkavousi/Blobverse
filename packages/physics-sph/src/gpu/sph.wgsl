struct Particle { pos: vec4<f32>, vel: vec4<f32>, rho: f32, pad: vec3<f32> }; @group(0) @binding(0) var<storage, read_write> particles : array<Particle>;

const PI: f32 = 3.141592653589793;

fn poly6(r: f32, h: f32) -> f32 {
  return select(0.0,
    315.0 / (64.0 * PI * pow(h, 9.0)) * pow(h * h - r * r, 3.0),
    r <= h);
}

fn spiky_grad(r: f32, h: f32) -> f32 {
  return select(0.0,
    -45.0 / (PI * pow(h, 6.0)) * pow(h - r, 2.0),
    r > 0.0 && r <= h);
}

@compute @workgroup_size(128) fn main(@builtin(global_invocation_id) gid: vec3<u32>) { let i = gid.x; if (i >= arrayLength(&particles)) { return; } var p = particles[i]; p.vel.y -= 9.81 * 0.016; p.pos.xyz += p.vel.xyz * 0.016; particles[i] = p; }
