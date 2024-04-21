import { injectable } from "inversify";

import { EntityStore } from "@rpg-village/core";

import { EntityID, MapElement } from "./interface";

@injectable()
export class MapStore extends EntityStore<EntityID, MapElement> {}
