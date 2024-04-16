import { BattleActivityStartArgs } from "../battle-activity";
import { BattleActivityType } from "../interfaces";

declare module "@rpg-village/core/features/activity" {
  interface ActivityType {
    [BattleActivityType.Battle]: BattleActivityStartArgs;
  }
}
