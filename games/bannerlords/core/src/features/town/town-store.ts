import { injectable } from "@rpg-village/core";
import { EntityStore } from "@rpg-village/core";

import { Town, TownID } from "./interface";

@injectable()
export class TownStore extends EntityStore<TownID, Town> {}
