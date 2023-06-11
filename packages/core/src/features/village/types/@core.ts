import {
  VillageCommand,
  VillageCommandHealPartyArgs,
  VillageEvent,
  VillageEventBuildingBuiltArgs,
  VillageState,
} from "../interfaces";

declare module "@core" {
  export interface EventType {
    [VillageEvent.BuildingBuilt]: VillageEventBuildingBuiltArgs;
  }

  export interface CommandType {
    [VillageCommand.HireHero]: undefined;
    [VillageCommand.HealParty]: VillageCommandHealPartyArgs;
    [VillageCommand.BuildHouse]: undefined;
  }

  export interface GameState {
    village: VillageState;
  }
}
