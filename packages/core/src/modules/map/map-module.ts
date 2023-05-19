import { Module } from "@core";

import { MapExploreActivity, MapTravelActivity } from "./activites";
import { MapActivity } from "./interfaces";
import { MapCommandHandler } from "./map-command-handler";
import { MapEventHandler } from "./map-event-handler";
import { MapLocationStore } from "./map-location-store";
import { MapService } from "./map-service";
import { MapStore } from "./map-store";

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
