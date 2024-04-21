import { createGameInstance as createBaseGameInstance } from "@rpg-village/core";

import { castleModule } from "@features/castle";
import { clanModule } from "@features/clan";
import { fractionModule } from "@features/fraction";
import { lordModule } from "@features/lord";
import { mapModule } from "@features/map";
import { timeModule } from "@features/time";
import { townModule } from "@features/town";
import { villageModule } from "@features/village";

import { gameModule } from "./game-module";

const GAME_MODULES = [
  gameModule,
  mapModule,
  fractionModule,
  clanModule,
  castleModule,
  villageModule,
  townModule,
  lordModule,
  timeModule,
];

export const createGameInstance = () => createBaseGameInstance({ modules: GAME_MODULES });
