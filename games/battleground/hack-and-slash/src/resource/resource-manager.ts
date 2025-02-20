import { find, propEq } from "rambda";

import { ResourceManager as IResourceManager, UnitConfig, UnitID } from "@rpg-village/battleground-core";

import units from "./units.json";

export class ResourceManager implements IResourceManager {
  getUnitConfig(unitId: UnitID): UnitConfig {
    return find(propEq(unitId, "id"), units as UnitConfig[]) as UnitConfig;
  }
}
