// mpm-grid.wgsl
// PB-MPM Grid solver pipeline

//!include dispatch.inc
//!include simConstants.inc

@compute @workgroup_size(8,8,1)
fn csMain(@builtin(local_invocation_index) idx : u32, @builtin(workgroup_id) gid : vec3<u32>) {
  // TODO: implement grid solver logic
} 