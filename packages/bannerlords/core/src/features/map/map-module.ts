import { Module } from "@rpg-village/core";

import { MapCommandHandler } from "./map-command-handler";
import { MapEventHandler } from "./map-event-handler";
import { MapMoveDirectionStore } from "./map-move-direction-store";
import { MapStore } from "./map-store";

export const mapModule: Module = {
  stores: [
    { scope: "map", store: MapStore },
    { scope: "mapMoveDirections", store: MapMoveDirectionStore },
  ],
  provides: [MapCommandHandler, MapEventHandler],
};
