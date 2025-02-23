import { EntityStore, injectableStore } from "@rpg-village/core";

import { Party, PartyID } from "./interface";

@injectableStore("parties", {})
export class PartyStore extends EntityStore<PartyID, Party> {}
