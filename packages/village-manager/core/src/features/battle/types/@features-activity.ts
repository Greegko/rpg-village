import { BattleActivityStartArgs } from "../battle-activity";
import { BattleActivityType } from "../interfaces";

declare module "@rpg-village/features/activity" {
  interface ActivityType {
    [BattleActivityType.Battle]: BattleActivityStartArgs;
  }
}
