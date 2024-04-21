import { createGameInstance as createBaseGameInstance, gameModule } from "@rpg-village/core";

import { castleModule } from "@features/castle";
import { clanModule } from "@features/clan";
import { fractionModule } from "@features/fraction";
import { lordModule } from "@features/lord";
import { mapModule } from "@features/map";
import { townModule } from "@features/town";
import { villageModule } from "@features/village";

const GAME_MODULES = [
  gameModule,
  mapModule,
  fractionModule,
  clanModule,
  castleModule,
  villageModule,
  townModule,
  lordModule,
];

export const createGameInstance = () => createBaseGameInstance({ modules: GAME_MODULES });
