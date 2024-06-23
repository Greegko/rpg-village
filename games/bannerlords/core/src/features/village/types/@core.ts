import {
  Village,
  VillageCommand,
  VillageCommandDisbandVillagerArgs,
  VillageCommandEnterVillageArgs,
  VillageCommandLeaveVillageArgs,
  VillageCommandSpawnVillagerArgs,
  VillageCommandTakeResourceArgs,
  VillageID,
} from "../interface";

declare module "@rpg-village/core" {
  interface CommandType {
    [VillageCommand.SpawnVillager]: VillageCommandSpawnVillagerArgs;
    [VillageCommand.DisbandVillager]: VillageCommandDisbandVillagerArgs;
    [VillageCommand.EnterVillage]: VillageCommandEnterVillageArgs;
    [VillageCommand.LeaveVillage]: VillageCommandLeaveVillageArgs;
    [VillageCommand.TakeResource]: VillageCommandTakeResourceArgs;
  }

  interface GameState {
    villages: Record<VillageID, Village>;
  }
}
