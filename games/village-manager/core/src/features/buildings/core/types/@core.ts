import "@rpg-village/core";

import { BuildingEvent, BuildingEventBuiltArgs } from "../interface";

declare module "@rpg-village/core" {
  interface EventType {
    [BuildingEvent.Built]: BuildingEventBuiltArgs;
  }
}
