import { Module } from "@core";

import { BattleActivity } from "./battle-activity";
import { BattleService } from "./battle-service";
import { BattleStore } from "./battle-store";
import { BattleActivityType } from "./interfaces";

export const battleModule: Module = {
  activities: [{ name: BattleActivityType.Battle, activity: BattleActivity }],
  stores: [{ scope: "battle", store: BattleStore }],
  provides: [BattleService],
};
