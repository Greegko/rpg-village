import { injectable } from "inversify";

import { EntityStore } from "@core/store";

import { MapLocation, MapLocationID } from "./interfaces";

@injectable()
export class MapLocationStore extends EntityStore<MapLocationID, MapLocation> {}
