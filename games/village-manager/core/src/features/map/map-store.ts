import { injectableStore } from "@rpg-village/core";
import { EntityStore } from "@rpg-village/core";

import { Map, MapID } from "./interfaces";

@injectableStore("maps", {})
export class MapStore extends EntityStore<MapID, Map> {}
