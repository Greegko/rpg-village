import { injectable } from "inversify";

import { EntityStore } from "@core";

import { Map, MapID } from "./interfaces";

@injectable()
export class MapStore extends EntityStore<MapID, Map> {}
