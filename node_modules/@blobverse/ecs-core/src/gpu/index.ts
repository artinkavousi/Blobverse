// GPU compute pipeline registration stub
export function registerComputePipeline(
  name: string,
  shaderSource: string,
  options: { workgroup: number | [number, number, number] }
): void {
  // TODO: integrate with ECS engine's GPU scheduler
  console.warn(`registerComputePipeline called for: ${name}`);
} 