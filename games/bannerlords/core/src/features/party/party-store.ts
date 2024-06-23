import { EntityStore } from "@rpg-village/core";

import { Party, PartyID } from "./interface";

export class PartyStore extends EntityStore<PartyID, Party> {}
