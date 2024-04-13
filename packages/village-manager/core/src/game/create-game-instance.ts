import { createGameInstance as createBaseGameInstance } from "@rpg-village/core";
import { activityModule } from "@rpg-village/core/features/activity";
import { battleModule } from "@rpg-village/core/features/battle";
import { debugModule } from "@rpg-village/core/features/debug";
import { gameModule } from "@rpg-village/core/features/game";
import { mapModule } from "@rpg-village/core/features/map";
import { optionsModule } from "@rpg-village/core/features/options";
import { partyModule } from "@rpg-village/core/features/party";
import { unitModule } from "@rpg-village/core/features/unit";
import { villageModule } from "@rpg-village/core/features/village";

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
