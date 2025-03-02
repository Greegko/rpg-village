import { mergeAll, mergeRight } from "rambda";

import { UnitConfig, UnitInit, UnitSetup } from "@rpg-village/battleground-core";

import buildings from "./buildings.json";
import units from "./units.json";

const getConfig = (id: string): UnitConfig =>
  (units as UnitConfig[]).find(x => x.id === id) || (buildings as UnitConfig[]).find(x => x.id === id)!;

const unitFactory =
  (id: string) =>
  (unitConfigOverride: UnitSetup & Partial<UnitConfig>): UnitInit =>
    mergeRight(getConfig(id), unitConfigOverride);

export const createDummyUnit = (unitConfigOverride: Pick<UnitSetup, "position" | "team">): UnitInit =>
  mergeAll<any>([getConfig("skeleton"), { hp: 1000, maxHp: 1000, actions: [] }, unitConfigOverride]);

export const castleBuilding = unitFactory("castle");
export const skeletonUnit = unitFactory("skeleton");
export const archerUnit = unitFactory("archer");
export const priestUnit = unitFactory("priest");
export const flagBearerUnit = unitFactory("flag-bearer");
