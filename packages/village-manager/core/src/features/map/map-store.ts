import { injectable } from "inversify";

import { EntityStore } from "@rpg-village/core";

import { Map, MapID } from "./interfaces";

@injectable()
export class MapStore extends EntityStore<MapID, Map> {}
