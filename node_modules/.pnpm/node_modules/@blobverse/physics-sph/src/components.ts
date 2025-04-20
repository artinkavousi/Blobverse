import { defineComponent, Types } from 'bitecs';

/** Position (x,y,z) in world space - meters */
export const Position = defineComponent({
  x: Types.f32,
  y: Types.f32,
  z: Types.f32,
});

/** Velocity (m s⁻¹) */
export const Velocity = defineComponent({
  x: Types.f32,
  y: Types.f32,
  z: Types.f32,
});

/** Density + Pressure scalars (SPH) */
export const Fluid = defineComponent({
  density: Types.f32,
  pressure: Types.f32,
}); 