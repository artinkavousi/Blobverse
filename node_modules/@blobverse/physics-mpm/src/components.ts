import { defineComponent, Types } from 'bitecs';
export const Position   = defineComponent({ x: Types.f32, y: Types.f32, z: Types.f32 });
export const Velocity   = defineComponent({ x: Types.f32, y: Types.f32, z: Types.f32 });
export const Fgrad      = defineComponent({ xx: Types.f32, xy: Types.f32, xz: Types.f32, yx: Types.f32, yy: Types.f32, yz: Types.f32, zx: Types.f32, zy: Types.f32, zz: Types.f32 });
export const MaterialId = defineComponent({ id: Types.ui16 }); 