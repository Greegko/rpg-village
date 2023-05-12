import { PartyID } from "@modules/party";

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

declare module "@core/global-type/command-type" {
  interface CommandType {
    [VillageCommand.BuildHouse]: undefined;
    [VillageCommand.BuildBlacksmith]: undefined;
    [VillageCommand.BuildTrainingField]: undefined;
    [VillageCommand.BuildRuneWorkshop]: undefined;
    [VillageCommand.BuildPortalSummonerStone]: undefined;
    [VillageCommand.BuildShop]: undefined;
    [VillageCommand.HireHero]: undefined;
    [VillageCommand.HealParty]: VillageCommandHealPartyArgs;
    [VillageCommand.GenerateShopItems]: undefined;
  }
}
