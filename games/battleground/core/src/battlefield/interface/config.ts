import { createInjectableToken } from "@greegko/tiny-di";

import { Position } from "@rpg-village/utils/node";

type Size = [number, number];

export type BattlefieldConfig = {
  mapSize: Size;
  cameraPosition: Position;
  viewport: Size;
  seed: string;
};

export const BattlefieldConfigToken = createInjectableToken<BattlefieldConfig>("BattlefieldConfig");
