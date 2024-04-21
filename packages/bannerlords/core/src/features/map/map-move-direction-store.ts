import { KeyValueStore } from "@rpg-village/core";

import { Direction, EntityID } from "./interface";

export class MapMoveDirectionStore extends KeyValueStore<EntityID, Direction> {}
