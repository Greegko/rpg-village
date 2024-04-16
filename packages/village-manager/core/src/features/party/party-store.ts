import { injectable } from "inversify";

import { EntityStore } from "@rpg-village/core";

import { Party, PartyID } from "./interfaces";

@injectable()
export class PartyStore extends EntityStore<PartyID, Party> {}
