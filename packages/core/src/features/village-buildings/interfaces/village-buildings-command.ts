import { VillageID } from "@features/village";

export enum VillageBuildingsCommand {
  BuildBlacksmith = "village/build-blacksmith",
  BuildTrainingField = "village/build-training-field",
  BuildRuneWorkshop = "village/build-rune-workshop",
  BuildPortalSummonerStone = "village/build-portal-summoner-stone",
  BuildShop = "village/build-shop",
  GenerateShopItems = "village/generate-shop-items",
}

export interface VillageBuildingCommandBuildBlacksmithArgs {
  villageId: VillageID;
}
export interface VillageBuildingCommandBuildRuneWorkshopArgs {
  villageId: VillageID;
}
export interface VillageBuildingBuildShopArgs {
  villageId: VillageID;
}
export interface VillageBuildingCommandBuildTrainingFieldArgs {
  villageId: VillageID;
}
export interface VillageBuildingCommandBuildPortalSummonerStoneArgs {
  villageId: VillageID;
}
