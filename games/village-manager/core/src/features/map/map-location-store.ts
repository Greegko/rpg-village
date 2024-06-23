import { injectable } from "inversify";

import { EntityStore } from "@rpg-village/core";

import { MapLocation, MapLocationID } from "./interfaces";

@injectable()
export class MapLocationStore extends EntityStore<MapLocationID, MapLocation> {}
