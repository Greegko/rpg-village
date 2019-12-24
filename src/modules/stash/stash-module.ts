import { Module } from "../../models";
import { StashItems } from './stash-items';
import { StashResource } from './stash-resource';
import { StashService } from "./stash-service";
import { StashStore } from "./stash-store";

export const stashModule: Module = {
  stores: [{ scope: 'stash', store: StashStore }],
  provides: [StashItems, StashResource, StashService]
};
