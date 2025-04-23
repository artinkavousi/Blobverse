// mpm-p2g.wgsl
// PB-MPM Particle-to-Grid (P2G) pipeline

//!include dispatch.inc
//!include simConstants.inc
//!include bukkit.inc
//!include particle.inc

@compute @workgroup_size(128)
fn csMain(@builtin(local_invocation_index) idx : u32, @builtin(workgroup_id) gid : vec3<u32>) {
  // TODO: implement P2G particle-to-grid transfer logic
} 