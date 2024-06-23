import {
  VillageBuildingBuildShopArgs,
  VillageBuildingCommand,
  VillageBuildingCommandBuildBlacksmithArgs,
  VillageBuildingCommandBuildHouseArgs,
  VillageBuildingCommandBuildPortalSummoningStoneArgs,
  VillageBuildingCommandBuildRuneWorkshopArgs,
  VillageBuildingCommandBuildTrainingFieldArgs,
  VillageBuildingCommandGenerateShopItemsArgs,
  VillageBuildingCommandPortalSummoningStoneOpenPortalArgs,
  VillageBuildingCommandShopBuyItemArgs,
  VillageCommand,
  VillageCommandHealPartyArgs,
  VillageCommandHeroHireArgs,
  VillageEvent,
  VillageEventBuildingBuiltArgs,
  VillageID,
  VillageState,
} from "../interfaces";

declare module "@rpg-village/core" {
  interface EventType {
    [VillageEvent.BuildingBuilt]: VillageEventBuildingBuiltArgs;
  }

  interface CommandType {
    [VillageCommand.HireHero]: VillageCommandHeroHireArgs;
    [VillageCommand.HealParty]: VillageCommandHealPartyArgs;
  }

  interface CommandType {
    [VillageBuildingCommand.BuildHouse]: VillageBuildingCommandBuildHouseArgs;
    [VillageBuildingCommand.BuildBlacksmith]: VillageBuildingCommandBuildBlacksmithArgs;
    [VillageBuildingCommand.BuildTrainingField]: VillageBuildingCommandBuildRuneWorkshopArgs;
    [VillageBuildingCommand.BuildRuneWorkshop]: VillageBuildingBuildShopArgs;
    [VillageBuildingCommand.BuildPortalSummoningStone]: VillageBuildingCommandBuildTrainingFieldArgs;
    [VillageBuildingCommand.PortalSummoningStoneOpenPortal]: VillageBuildingCommandPortalSummoningStoneOpenPortalArgs;
    [VillageBuildingCommand.BuildShop]: VillageBuildingCommandBuildPortalSummoningStoneArgs;
    [VillageBuildingCommand.ShopBuyItem]: VillageBuildingCommandShopBuyItemArgs;
    [VillageBuildingCommand.GenerateShopItems]: VillageBuildingCommandGenerateShopItemsArgs;
  }

  interface GameState {
    villages: Record<VillageID, VillageState>;
  }
}
