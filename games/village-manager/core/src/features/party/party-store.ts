import { injectableStore } from "@rpg-village/core";
import { EntityStore } from "@rpg-village/core";

import { Party, PartyID } from "./interfaces";

@injectableStore("parties", {})
export class PartyStore extends EntityStore<PartyID, Party> {}
