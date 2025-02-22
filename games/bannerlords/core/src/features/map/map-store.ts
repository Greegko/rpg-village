import { injectable } from "@rpg-village/core";
import { KeyValueStore } from "@rpg-village/core";

import { EntityID, Point } from "./interface";

@injectable()
export class MapStore extends KeyValueStore<EntityID, Point> {}
