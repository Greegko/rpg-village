import { BuildingActivityType, BuildingEventBuiltArgs } from "../interface";

declare module "@rpg-village/features/activity" {
  interface ActivityType {
    [BuildingActivityType.Build]: BuildingEventBuiltArgs;
  }
}
