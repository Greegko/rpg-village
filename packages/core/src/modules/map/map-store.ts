import { injectable } from "inversify";
import { EntityStore } from "@core/store";
import { MapID, Map } from "./interfaces";

@injectable()
export class MapStore extends EntityStore<MapID, Map> {}
