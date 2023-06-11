import { PartyID } from "@features/party";

export enum VillageCommand {
  BuildHouse = "village/build-house",
  HireHero = "village/hire-unit",
  HealParty = "village/heal",
}

export interface VillageCommandHealPartyArgs {
  partyId: PartyID;
}
