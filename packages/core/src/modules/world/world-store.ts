import { injectable } from "inversify";
import { EntityStore } from "@core/store";
import { MapLocation, MapLocationID } from "./interfaces";

@injectable()
export class WorldStore extends EntityStore<MapLocation, MapLocationID> {}
