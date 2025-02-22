import "@rpg-village/core";

import { TimeEvent } from "../interface";

declare module "@rpg-village/core/extend" {
  interface EventType {
    [TimeEvent.NewDay]: undefined;
  }
}
