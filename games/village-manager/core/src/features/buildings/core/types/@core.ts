import "@rpg-village/core";

import { BuildingEvent, BuildingEventBuiltArgs } from "../interface";

declare module "@rpg-village/core/extend" {
  interface EventType {
    [BuildingEvent.Built]: BuildingEventBuiltArgs;
  }
}
