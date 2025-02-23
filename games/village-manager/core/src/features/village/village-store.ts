import { injectableStore } from "@rpg-village/core";
import { EntityStore } from "@rpg-village/core";

import { VillageID, VillageState } from "./interfaces";

@injectableStore("villages", {})
export class VillageStore extends EntityStore<VillageID, VillageState> {}
