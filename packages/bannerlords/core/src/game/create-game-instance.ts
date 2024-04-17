import { activityModule } from "@rpg-village/features/activity";

import { createGameInstance as createBaseGameInstance } from "@rpg-village/core";
import { gameModule } from "@rpg-village/core/features/game";
import { mapModule } from "@rpg-village/core/features/map";

const GAME_MODULES = [mapModule, gameModule, activityModule];

export const createGameInstance = () => createBaseGameInstance({ modules: GAME_MODULES });
