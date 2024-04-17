import { createGameInstance as createBaseGameInstance, gameModule } from "@rpg-village/core";

import { activityModule } from "@rpg-village/features/activity";

const GAME_MODULES = [gameModule, activityModule];

export const createGameInstance = () => createBaseGameInstance({ modules: GAME_MODULES });
