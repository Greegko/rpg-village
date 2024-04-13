import "rambda";

/* Fix Rambda Typings to indentical type usages */

declare module "rambda" {
  function mergeWith<T>(fn: (x: any, z: any) => any, a: T): (b: T) => T;
  function append<T>(x: T): (list: T[]) => T[];
  function prop<P extends keyof T, T extends object>(p: P): (v: T) => T[P];
  function flatten<T>(list: T[][]): T[];
}
