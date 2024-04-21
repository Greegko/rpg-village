import { injectable } from "inversify";

import { EntityStore } from "@rpg-village/core";

import { Village, VillageID } from "./interface";

@injectable()
export class VillageStore extends EntityStore<VillageID, Village> {}
