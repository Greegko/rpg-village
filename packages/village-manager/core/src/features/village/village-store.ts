import { injectable } from "inversify";

import { EntityStore } from "@rpg-village/core";

import { VillageID, VillageState } from "./interfaces";

@injectable()
export class VillageStore extends EntityStore<VillageID, VillageState> {}
