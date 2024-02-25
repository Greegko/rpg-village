import {
  VillageCommand,
  VillageCommandHealPartyArgs,
  VillageConfig,
  VillageEvent,
  VillageEventBuildingBuiltArgs,
  VillageState,
} from "../interfaces";

declare module "@core" {
  interface EventType {
    [VillageEvent.BuildingBuilt]: VillageEventBuildingBuiltArgs;
  }

  interface CommandType {
    [VillageCommand.HireHero]: undefined;
    [VillageCommand.HealParty]: VillageCommandHealPartyArgs;
    [VillageCommand.BuildHouse]: undefined;
  }

  interface GameState {
    village: VillageState;
  }

  interface ModuleConfig {
    [VillageConfig.DirectLootToVillage]: boolean;
  }
}
