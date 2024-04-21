import { injectable } from "inversify";

import { EntityStore } from "@rpg-village/core";

import { MapElement, MapElementID } from "./interface";

@injectable()
export class MapStore extends EntityStore<MapElementID, MapElement> {}
