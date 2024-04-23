import { VillageID } from "./village";

export interface VillageCommandSpawnVillagerArgs {
  villageId: VillageID;
}

export enum VillageCommand {
  SpawnVillager = "village/spawn-villager",
}
