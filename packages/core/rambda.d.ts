import { Evolvable, Evolver } from "../../node_modules/rambda";

export * from "../../node_modules/rambda";

/* Fix Rambda Typings to indentical type usages */

declare module "rambda" {
  function mergeWith<T>(fn: (x: any, z: any) => any, a: T): (b: T) => T;
  function append<T>(x: T): (list: T[]) => T[];
  function prop<P extends keyof T, T extends object>(p: P): (v: T) => T[P];
  function flatten<T>(list: T[][]): T[];
  function evolve<E extends Evolver, V extends Evolvable<E>>(rules: E, obj: V): V;
}
