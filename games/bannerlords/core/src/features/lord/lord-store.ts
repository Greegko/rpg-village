import { injectableStore } from "@rpg-village/core";
import { EntityStore } from "@rpg-village/core";

import { Lord, LordID } from "./interface";

@injectableStore("lords", {})
export class LordStore extends EntityStore<LordID, Lord> {}
