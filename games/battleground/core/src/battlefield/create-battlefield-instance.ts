import { SeededRandom } from "@rpg-village/utils/random";

import { RandomContextToken } from "@/features/random";

import { Battlefield } from "./context";
import { makeInjectable } from "./injection-container";
import { BattlefieldConfig, BattlefieldConfigToken, ResourceManager, ResourceManagerToken } from "./interface";

export const createBattlefieldInstance = (config: BattlefieldConfig, resourceManager: ResourceManager): Battlefield => {
  makeInjectable(BattlefieldConfigToken, config);
  makeInjectable(ResourceManagerToken, resourceManager);
  makeInjectable(RandomContextToken, SeededRandom.createFromText(config.seed));

  return new Battlefield();
};
