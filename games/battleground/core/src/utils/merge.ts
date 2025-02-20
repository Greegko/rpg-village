import { mergeWith } from "rambda";

function mergeWithUndefined<A, B>(a: A, b: B): A | B {
  return b === undefined ? a : b;
}

export const merge = <S, T>(a: S, b: T): S & T => mergeWith(mergeWithUndefined, a as any, b as any) as any;
