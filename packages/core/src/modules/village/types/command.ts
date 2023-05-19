import "@core/command";

import { VillageCommand, VillageCommandHealPartyArgs } from "../interfaces";

declare module "@core/command" {
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
