import { KeyValueStore, injectableStore } from "@rpg-village/core";

import { Direction, EntityID } from "./interface";

@injectableStore("mapMoveDirections", {})
export class MapMoveDirectionStore extends KeyValueStore<EntityID, Direction> {}
