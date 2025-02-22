import { injectable } from "@rpg-village/core";
import { EntityStore } from "@rpg-village/core";

import { VillageID, VillageState } from "./interfaces";

@injectable()
export class VillageStore extends EntityStore<VillageID, VillageState> {}
