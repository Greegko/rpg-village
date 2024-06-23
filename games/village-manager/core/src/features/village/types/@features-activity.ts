import { VillageActivityBuildStartArgs, VillageActivityHealStartArgs } from "../activities";
import { VillageActivity } from "../interfaces";

declare module "@rpg-village/features/activity" {
  interface ActivityType {
    [VillageActivity.Build]: VillageActivityBuildStartArgs;
    [VillageActivity.Heal]: VillageActivityHealStartArgs;
  }
}
