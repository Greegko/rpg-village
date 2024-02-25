import { VillageActivityBuildStartArgs, VillageActivityHealStartArgs } from "../activities";
import { VillageActivity } from "../interfaces";

declare module "@features/activity" {
  export interface ActivityType {
    [VillageActivity.Build]: VillageActivityBuildStartArgs;
    [VillageActivity.Heal]: VillageActivityHealStartArgs;
  }
}
