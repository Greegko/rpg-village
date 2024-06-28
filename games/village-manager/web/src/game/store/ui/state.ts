import { MapID, VillageID } from "@rpg-village/village-manager-core";

export enum GamePageType {
  CharacterSheet,
  OpenPortal,
  VillageShopPage,
}

export interface GamePage {
  page: GamePageType;
  args?: any;
}

export interface GameUIState {
  paused: boolean;
  ai: boolean;
  selectedVillageId?: VillageID;
  page?: GamePage;
  map?: MapID;
}
