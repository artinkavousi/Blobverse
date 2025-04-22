// mpm-g2p.wgsl
// PB-MPM Grid-to-Particle (G2P) pipeline

//!include dispatch.inc
//!include simConstants.inc
//!include particle.inc

@compute @workgroup_size(128)
fn csMain(@builtin(local_invocation_index) idx : u32, @builtin(workgroup_id) gid : vec3<u32>) {
  // TODO: implement G2P grid-to-particle transfer logic
} 