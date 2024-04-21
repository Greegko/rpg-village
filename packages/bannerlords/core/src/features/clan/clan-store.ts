import { injectable } from "inversify";

import { EntityStore } from "@rpg-village/core";

import { Clan, ClanID } from "./interface";

@injectable()
export class ClanStore extends EntityStore<ClanID, Clan> {}
