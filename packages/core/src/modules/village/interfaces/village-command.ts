import { PartyID } from "@modules/party";

export enum VillageCommand {
  BuildHouse = "village/build-house",
  BuildBlacksmith = "village/build-blacksmith",
  BuildTrainingField = "village/build-training-field",
  BuildRuneWorkshop = "village/build-rune-workshop",
  BuildPortals = "village/build-portals",
  HireHero = "village/hire-unit",
  HealParty = "village/heal",
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
    [VillageCommand.BuildPortals]: undefined;
    [VillageCommand.HireHero]: undefined;
    [VillageCommand.HealParty]: VillageCommandHealPartyArgs;
  }
}
