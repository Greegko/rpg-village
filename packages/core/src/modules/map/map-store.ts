import { injectable } from "inversify";
import { EntityStore } from "@core/store";
import { MapLocation, MapLocationID } from "./interfaces";

@injectable()
export class MapStore extends EntityStore<MapLocation, MapLocationID> {}
