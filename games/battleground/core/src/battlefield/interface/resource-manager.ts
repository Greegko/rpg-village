import { createInjectableToken } from "@greegko/tiny-di";

import { UnitConfig } from "./unit";

export interface ResourceManager {
  getUnitConfig(unitId: string): UnitConfig;
}

export const ResourceManagerToken = createInjectableToken<ResourceManager>("ResourceManagerToken");
