import { generate } from "shortid";

export function generateId<T extends string & { __typeGuard: string }>(): T {
  return generate() as T;
}
