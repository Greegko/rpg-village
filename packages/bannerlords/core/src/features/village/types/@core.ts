import { Village, VillageCommand, VillageCommandSpawnVillagerArgs, VillageID } from "../interface";

declare module "@rpg-village/core" {
  interface CommandType {
    [VillageCommand.SpawnVillager]: VillageCommandSpawnVillagerArgs;
  }

  interface GameState {
    villages: Record<VillageID, Village>;
  }
}
