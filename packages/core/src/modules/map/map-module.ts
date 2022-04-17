import { Module } from "@core/module";
import { MapCommandHandler } from "./map-command-handler";
import { MapActivity } from "./interfaces";
import { MapStore } from "./map-store";
import { MapExploreActivity, MapTravelActivity } from "./activites";
import { Map } from "./map";
import { MapEventHandler } from "./map-event-handler";

export const mapModule: Module = {
  activities: [
    { name: MapActivity.Explore, activity: MapExploreActivity },
    { name: MapActivity.Travel, activity: MapTravelActivity },
  ],
  stores: [{ scope: "map", store: MapStore }],
  provides: [Map, MapEventHandler, MapCommandHandler],
};
