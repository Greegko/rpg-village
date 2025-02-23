import { injectableStore } from "@rpg-village/core";
import { EntityStore } from "@rpg-village/core";

import { Town, TownID } from "./interface";

@injectableStore("towns", {})
export class TownStore extends EntityStore<TownID, Town> {}
