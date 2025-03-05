import { find, propEq } from "rambda";

import { ResourceManager as IResourceManager, UnitConfig, UnitConfigID } from "@rpg-village/battleground-core";

import units from "./units.json";

export class ResourceManager implements IResourceManager {
  getUnitConfig(configId: UnitConfigID): UnitConfig {
    return find(propEq(configId, "configId"), units as UnitConfig[]) as UnitConfig;
  }
}
