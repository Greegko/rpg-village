import { injectableStore } from "@rpg-village/core";
import { KeyValueStore } from "@rpg-village/core";

import { EntityID, Point } from "./interface";

@injectableStore("map", {})
export class MapStore extends KeyValueStore<EntityID, Point> {}
