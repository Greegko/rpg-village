import { injectableStore } from "@rpg-village/core";
import { EntityStore } from "@rpg-village/core";

import { Clan, ClanID } from "./interface";

@injectableStore("clans", {})
export class ClanStore extends EntityStore<ClanID, Clan> {}
