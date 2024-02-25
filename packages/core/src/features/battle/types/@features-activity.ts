import { BattleActivityStartArgs } from "../battle-activity";
import { BattleActivityType } from "../interfaces";

declare module "@features/activity" {
  interface ActivityType {
    [BattleActivityType.Battle]: BattleActivityStartArgs;
  }
}
