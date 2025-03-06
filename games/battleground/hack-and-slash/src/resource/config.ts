import { mergeAll, mergeRight } from "rambda";

import { UnitConfig, UnitConfigID, UnitInit, UnitSetup } from "@rpg-village/battleground-core";

import units from "./units.json";

export const getConfig = (id: UnitConfigID): UnitConfig => (units as UnitConfig[]).find(x => x.configId === id)!;

const unitFactory =
  (id: UnitConfigID) =>
  (unitConfigOverride: UnitSetup & Partial<UnitConfig>): UnitInit =>
    mergeRight(getConfig(id), unitConfigOverride);

export const createDummyUnit = (unitConfigOverride: Pick<UnitSetup, "position" | "team">): UnitInit =>
  mergeAll([getConfig("skeleton"), { hp: 1000, maxHp: 1000, actions: [] }, unitConfigOverride]);

export const createWeakDummyUnit = (unitConfigOverride: Pick<UnitSetup, "position" | "team">): UnitInit =>
  mergeAll([getConfig("skeleton"), { hp: 10, maxHp: 1000, actions: [] }, unitConfigOverride]);

export const skeletonUnit = unitFactory("skeleton");
export const heroUnit = unitFactory("hero");
