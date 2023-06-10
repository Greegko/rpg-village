import { PartyID } from "@features/party";

export enum VillageCommand {
  BuildHouse = "village/build-house",
  BuildBlacksmith = "village/build-blacksmith",
  BuildTrainingField = "village/build-training-field",
  BuildRuneWorkshop = "village/build-rune-workshop",
  BuildPortalSummonerStone = "village/build-portal-summoner-stone",
  BuildShop = "village/build-shop",
  HireHero = "village/hire-unit",
  HealParty = "village/heal",
  GenerateShopItems = "village/generate-shop-items",
}

export interface VillageCommandHealPartyArgs {
  partyId: PartyID;
}
