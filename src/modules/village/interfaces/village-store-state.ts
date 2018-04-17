import { Resource, Stash } from '@greegko/rpg-model';

export interface VillageStoreState {
  houses: number;
  stash: Stash;
  resource: Resource;
}
