import { injectableStore } from "@rpg-village/core";
import { EntityStore } from "@rpg-village/core";

import { Village, VillageID } from "./interface";

@injectableStore("villages", {})
export class VillageStore extends EntityStore<VillageID, Village> {}
