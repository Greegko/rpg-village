import { injectableStore } from "@rpg-village/core";
import { EntityStore } from "@rpg-village/core";

import { MapLocation, MapLocationID } from "./interfaces";

@injectableStore("mapLocations", {})
export class MapLocationStore extends EntityStore<MapLocationID, MapLocation> {}
