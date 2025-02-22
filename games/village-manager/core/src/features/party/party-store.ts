import { injectable } from "@rpg-village/core";
import { EntityStore } from "@rpg-village/core";

import { Party, PartyID } from "./interfaces";

@injectable()
export class PartyStore extends EntityStore<PartyID, Party> {}
