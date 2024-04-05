import { generate } from "shortid";

export function generateId<T extends string>(): T {
  return generate() as T;
}
