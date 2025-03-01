import { createInjectableToken } from "@greegko/tiny-di";

export type BattlefieldConfig = {
  mapSize: [number, number];
  objects: Object[];
  seed: string;
};

export const BattlefieldConfigToken = createInjectableToken<BattlefieldConfig>("BattlefieldConfig");
