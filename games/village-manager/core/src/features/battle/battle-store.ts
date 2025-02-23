import { injectableStore } from "@rpg-village/core";
import { EntityStore } from "@rpg-village/core";

import { BattleID, BattleStoreState } from "./interfaces";

@injectableStore("battle", {})
export class BattleStore extends EntityStore<BattleID, BattleStoreState> {}
