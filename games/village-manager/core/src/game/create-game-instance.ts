import { createGameInstance as createBaseGameInstance } from "@rpg-village/core";

import { activityModule } from "@rpg-village/features/activity";

import { battleModule } from "@features/battle";
import { debugModule } from "@features/debug";
import { mapModule } from "@features/map";
import { optionsModule } from "@features/options";
import { partyModule } from "@features/party";
import { unitModule } from "@features/unit";
import { villageModule } from "@features/village";

const GAME_MODULES = [
  villageModule,
  debugModule,
  optionsModule,
  mapModule,
  activityModule,
  partyModule,
  battleModule,
  unitModule,
];

export const createGameInstance = () => createBaseGameInstance({ modules: GAME_MODULES });
