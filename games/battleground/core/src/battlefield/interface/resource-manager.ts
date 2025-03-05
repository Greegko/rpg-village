import { createInjectableToken } from "@greegko/tiny-di";

import { UnitConfig, UnitConfigID } from "@/features/unit";

export interface ResourceManager {
  getUnitConfig(unitId: UnitConfigID): UnitConfig;
}

export const ResourceManagerToken = createInjectableToken<ResourceManager>("ResourceManagerToken");
