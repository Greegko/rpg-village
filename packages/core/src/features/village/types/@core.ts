import {
  VillageCommand,
  VillageCommandBuildHouseArgs,
  VillageCommandHealPartyArgs,
  VillageCommandHeroHireArgs,
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
    [VillageCommand.HireHero]: VillageCommandHeroHireArgs;
    [VillageCommand.HealParty]: VillageCommandHealPartyArgs;
    [VillageCommand.BuildHouse]: VillageCommandBuildHouseArgs;
  }

  interface GameState {
    village: VillageState;
  }

  interface ModuleConfig {
    [VillageConfig.DirectLootToVillage]: boolean;
  }
}
