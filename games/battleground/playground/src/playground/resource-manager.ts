import { find, propEq } from "rambda";

import { ConfigID, ResourceManager as IResourceManager, UnitConfig } from "@rpg-village/battleground-core";

import buildings from "./buildings.json";
import units from "./units.json";

export class ResourceManager implements IResourceManager {
  getUnitConfig(configId: ConfigID): UnitConfig {
    return (
      (find(propEq(configId, "configId"), units as UnitConfig[]) as UnitConfig) ||
      (find(propEq(configId, "configId"), buildings as UnitConfig[]) as UnitConfig)
    );
  }
}
