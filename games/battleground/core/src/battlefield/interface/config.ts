import { createInjectableToken } from "@greegko/tiny-di";

import { Map } from "@/features/map";

export type BattlefieldConfig = {
  seed: string;
  map: Map;
};

export const BattlefieldConfigToken = createInjectableToken<BattlefieldConfig>("BattlefieldConfig");
