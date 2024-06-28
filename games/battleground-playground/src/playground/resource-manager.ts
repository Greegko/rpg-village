import { find, propEq } from "rambda";

import { ResourceManager as IResourceManager, UnitConfig } from "@rpg-village/battleground";

import buildings from "./buildings.json";
import units from "./units.json";

export class ResourceManager implements IResourceManager {
  getUnitConfig(unitId: string): UnitConfig {
    return (
      (find(propEq(unitId, "id"), units as UnitConfig[]) as UnitConfig) ||
      (find(propEq(unitId, "id"), buildings as UnitConfig[]) as UnitConfig)
    );
  }
}
