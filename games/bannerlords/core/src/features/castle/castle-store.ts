import { injectableStore } from "@rpg-village/core";
import { EntityStore } from "@rpg-village/core";

import { Castle, CastleID } from "./interface";

@injectableStore("castles", {})
export class CastleStore extends EntityStore<CastleID, Castle> {}
