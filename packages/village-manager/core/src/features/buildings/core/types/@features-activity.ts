import { BuildingActivityType, BuildingEventBuiltArgs } from "../interface";

declare module "@rpg-village/core/features/activity" {
  interface ActivityType {
    [BuildingActivityType.Build]: BuildingEventBuiltArgs;
  }
}
