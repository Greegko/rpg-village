import { PartyID } from "@modules/party";

export enum VillageCommand {
  BuildHouse = "village/build-house",
  BuildBlacksmith = "village/build-blacksmith",
  BuildTrainingField = "village/build-training-field",
  BuildRuneWorkshop = "village/build-rune-workshop",
  GenerateGold = "village/generate-gold",
  HireHero = "village/hire-unit",
  HealParty = "village/heal",
}

export interface VillageCommandHealPartyArgs {
  partyId: PartyID;
}

declare module "../../../core/command/command-type" {
  interface CommandType {
    [VillageCommand.BuildHouse]: undefined;
    [VillageCommand.BuildBlacksmith]: undefined;
    [VillageCommand.BuildTrainingField]: undefined;
    [VillageCommand.BuildRuneWorkshop]: undefined;
    [VillageCommand.GenerateGold]: undefined;
    [VillageCommand.HireHero]: undefined;
    [VillageCommand.HealParty]: VillageCommandHealPartyArgs;
  }
}
