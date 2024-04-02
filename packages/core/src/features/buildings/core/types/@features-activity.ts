import { BuildingActivityType, BuildingEventBuiltArgs } from "../interface";

declare module "@features/activity" {
  interface ActivityType {
    [BuildingActivityType.Build]: BuildingEventBuiltArgs;
  }
}
