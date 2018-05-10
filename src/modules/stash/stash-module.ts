import { Module } from "@greegko/rpg-model";
import { StashItems } from './stash-items';
import { StashResource } from './stash-resource';

export const stashModule: Module = {
  provides: [StashItems, StashResource]
};
