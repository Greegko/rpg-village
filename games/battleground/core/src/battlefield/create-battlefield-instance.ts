import { Random } from "../utils";
import { Battlefield } from "./context";
import { inject, makeInjectable } from "./injection-container";
import { BattlefieldConfig, BattlefieldConfigToken, ResourceManager, ResourceManagerToken } from "./interface";
import { RandomContextToken } from "./interface/random-token";

export const createBattlefieldInstance = (config: BattlefieldConfig, resourceManager: ResourceManager): Battlefield => {
  makeInjectable(BattlefieldConfigToken, config);
  makeInjectable(ResourceManagerToken, resourceManager);
  makeInjectable(RandomContextToken, new Random(config.seed));

  return inject(Battlefield);
};
