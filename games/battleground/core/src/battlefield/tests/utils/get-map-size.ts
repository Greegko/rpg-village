import { max } from "rambda";

import { UnitInit } from "@/features/unit";

export function getMapSize(units: UnitInit[]): [number, number] {
  const xs = units.map(x => x.position.x + x.size + 5);
  const ys = units.map(x => x.position.y + x.size + 5);
  const maxX = xs.reduce(max, 0);
  const maxY = ys.reduce(max, 0);

  return [maxX, maxY];
}
