import { ShopItemID } from "@features/buildings/shop";
import { VillageID } from "@features/village";
import { ItemID } from "@models";

export enum VillageBuildingCommand {
  BuildHouse = "village/build-house",
  BuildBlacksmith = "village/build-blacksmith",
  BuildTrainingField = "village/build-training-field",
  BuildRuneWorkshop = "village/build-rune-workshop",
  BuildPortalSummoningStone = "village/build-portal-summoning-stone",

  PortalSummoningStoneOpenPortal = "village/portal-summoning-stone-open-portal",

  BuildShop = "village/build-shop",
  ShopBuyItem = "village/shop-buy-item",
  GenerateShopItems = "village/generate-shop-items",
}

export interface VillageBuildingCommandShopBuyItemArgs {
  villageId: VillageID;
  shopItemId: ShopItemID;
}
export interface VillageBuildingCommandBuildBlacksmithArgs {
  villageId: VillageID;
}
export interface VillageBuildingBuildShopArgs {
  villageId: VillageID;
}
export interface VillageBuildingCommandGenerateShopItemsArgs {
  villageId: VillageID;
}
export interface VillageBuildingCommandBuildRuneWorkshopArgs {
  villageId: VillageID;
}
export interface VillageBuildingCommandBuildTrainingFieldArgs {
  villageId: VillageID;
}
export interface VillageBuildingCommandBuildPortalSummoningStoneArgs {
  villageId: VillageID;
}
export interface VillageBuildingCommandBuildHouseArgs {
  villageId: VillageID;
}
export interface VillageBuildingCommandPortalSummoningStoneOpenPortalArgs {
  villageId: VillageID;
  dungeonKeyId: ItemID;
}
