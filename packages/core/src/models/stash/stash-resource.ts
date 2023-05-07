import { add, evolve, mergeWith, prop } from "rambda";
import { subtract } from "rambda";

import { Resource } from "../resource";
import { Stash } from "./stash";

export interface ResourceStash extends Stash {
  resource: Resource;
}

export function getResource(stash: ResourceStash): Resource {
  return prop("resource", stash);
}

export function addResource<T extends ResourceStash>(stash: T, resource: Partial<Resource>): T {
  return evolve({ resource: stashResource => mergeWith(add, stashResource, resource) }, stash);
}

export function removeResource<T extends ResourceStash>(stash: T, resource: Partial<Resource>): T {
  return evolve({ resource: stashResource => mergeWith(subtract, stashResource, resource) }, stash);
}
