import { createInjectableToken } from "@greegko/tiny-di";

export type BattlefieldConfig = {
  mapSize: [number, number];
  seed: string;
};

export const BattlefieldConfigToken = createInjectableToken<BattlefieldConfig>("BattlefieldConfig");
