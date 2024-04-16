import { activityModule } from "@rpg-village/core/features/activity";
import { gameModule } from "@rpg-village/core/features/game";
import { createGameInstance as createBaseGameInstance } from "@rpg-village/core/game";

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
  gameModule,
  optionsModule,
  mapModule,
  activityModule,
  partyModule,
  battleModule,
  unitModule,
];

export const createGameInstance = () => createBaseGameInstance({ modules: GAME_MODULES });
