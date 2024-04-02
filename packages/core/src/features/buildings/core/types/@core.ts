import { BuildingEvent, BuildingEventBuiltArgs } from "../interface";

declare module "@core" {
  interface EventType {
    [BuildingEvent.Built]: BuildingEventBuiltArgs;
  }
}
