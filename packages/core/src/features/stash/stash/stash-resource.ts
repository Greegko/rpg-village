import { add, evolve, mergeWith, prop, subtract } from "rambda";

import "@core-types";

import { Resource } from "../resource";

export interface ResourceStash {
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
