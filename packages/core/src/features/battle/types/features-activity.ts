import { BattleActivityStartArgs } from "../battle-activity";
import { BattleActivityType } from "../interfaces";

declare module "@features/activity" {
  export interface ActivityType {
    [BattleActivityType.Battle]: BattleActivityStartArgs;
  }
}
