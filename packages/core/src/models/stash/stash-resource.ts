import { prop, mergeDeepWith, add, subtract } from "ramda";
import { Stash } from "./stash";
import { Resource } from "../resource";

export interface ResourceStash extends Stash {
  resource: Resource;
}

export function getResource(stash: ResourceStash): Resource {
  return prop("resource", stash);
}

export function addResource<T extends ResourceStash>(stash: T, resource: Partial<Resource>): T {
  return mergeDeepWith(add, stash, { resource });
}

export function removeResource<T extends ResourceStash>(stash: T, resource: Partial<Resource>): T {
  return mergeDeepWith(subtract, stash, { resource });
}
