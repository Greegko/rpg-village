import { MapID } from "./map";
import { MapLocationID } from "./map-location";

export enum MapEvent {
  NewLocation = "map/new-location",
  IncreaseDifficulty = "map/increase-difficulty",
}

export type MapEventNewLocationArgs = { mapId: MapID; locationId: MapLocationID };
export type MapEventIncreaseDifficultyArgs = { mapId: MapID; difficultyIncrease: number };

declare module "@core/event/event-type" {
  export interface EventType {
    [MapEvent.NewLocation]: MapEventNewLocationArgs;
    [MapEvent.IncreaseDifficulty]: MapEventIncreaseDifficultyArgs;
  }
}
