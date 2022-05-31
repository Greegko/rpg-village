import { Module } from "@core/module";
import { MapCommandHandler } from "./map-command-handler";
import { MapActivity } from "./interfaces";
import { MapStore } from "./map-store";
import { MapExploreActivity, MapTravelActivity } from "./activites";
import { MapService } from "./map-service";
import { MapEventHandler } from "./map-event-handler";
import { MapLocationStore } from "./map-location-store";

export const mapModule: Module = {
  activities: [
    { name: MapActivity.Explore, activity: MapExploreActivity },
    { name: MapActivity.Travel, activity: MapTravelActivity },
  ],
  stores: [
    { scope: "maps", store: MapStore },
    { scope: "mapLocations", store: MapLocationStore },
  ],
  provides: [MapService, MapEventHandler, MapCommandHandler],
};
