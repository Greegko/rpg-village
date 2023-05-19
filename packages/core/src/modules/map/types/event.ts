import "@core/event";

import { MapEvent, MapEventNewLocationArgs } from "../interfaces";

declare module "@core/event" {
  export interface EventType {
    [MapEvent.NewLocation]: MapEventNewLocationArgs;
  }
}
