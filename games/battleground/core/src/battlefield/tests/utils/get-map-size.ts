import { max } from "rambda";

import { BattlefieldInit } from "../../battlefield";

export function getMapSize(initialState: BattlefieldInit): [number, number] {
  const xs = initialState.units.map(x => x.location.x + x.size + 5);
  const ys = initialState.units.map(x => x.location.y + x.size + 5);
  const maxX = xs.reduce(max, 0);
  const maxY = ys.reduce(max, 0);

  return [maxX, maxY];
}
