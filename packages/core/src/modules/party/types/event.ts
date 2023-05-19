import "@core/event";

import { PartyEvent, PartyEventArrivedToLocationArgs } from "../interfaces";

declare module "@core/event" {
  export interface EventType {
    [PartyEvent.ArrivedToLocation]: PartyEventArrivedToLocationArgs;
  }
}
