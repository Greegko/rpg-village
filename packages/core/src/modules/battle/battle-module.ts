import { Module } from "@core/module";
import { BattleService } from "./battle-service";
import { BattleStore } from "./battle-store";
import { BattleActivity } from "./battle-activity";
import { BattleActivityType } from "./interfaces";

export const battleModule: Module = {
  activities: [{ name: BattleActivityType.Battle, activity: BattleActivity }],
  stores: [{ scope: "battle", store: BattleStore }],
  provides: [BattleService],
};
