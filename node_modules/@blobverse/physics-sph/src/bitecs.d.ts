declare module 'bitecs' {
  export function defineQuery(components: any[]): any;
  export function enterQuery(queryResult: any): (world: any) => number[];
  export function defineComponent(schema: any): any;
  export const Types: {
    f32: any;
    f64: any;
    // add other type definitions as needed
  };
} 