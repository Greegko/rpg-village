import { MapEvent, MapEventNewLocationArgs } from "../interfaces";

declare module "@core" {
  export interface EventType {
    [MapEvent.NewLocation]: MapEventNewLocationArgs;
  }
}
