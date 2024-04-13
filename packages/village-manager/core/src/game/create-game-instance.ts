import {
  activityModule,
  battleModule,
  createGameInstance as createBaseGameInstance,
  debugModule,
  gameModule,
  mapModule,
  optionsModule,
  partyModule,
  unitModule,
  villageModule,
} from "@rpg-village/core";

const GAME_MODULES = [
  villageModule,
  debugModule,
  gameModule,
  optionsModule,
  mapModule,
  activityModule,
  partyModule,
  battleModule,
  unitModule,
];

export const createGameInstance = () => createBaseGameInstance({ modules: GAME_MODULES });
