import { createInjectableToken } from "../injection-container";

export type BattlefieldConfig = {
  mapSize: [number, number];
  seed: string;
};

export const BattlefieldConfigToken = createInjectableToken<BattlefieldConfig>("BattlefieldConfig");
