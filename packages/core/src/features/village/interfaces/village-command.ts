import { PartyID } from "@features/party";

import { VillageID } from "./village";

export enum VillageCommand {
  BuildHouse = "village/build-house",
  HireHero = "village/hire-unit",
  HealParty = "village/heal",
}

export interface VillageCommandHealPartyArgs {
  villageId: VillageID;
  partyId: PartyID;
}

export interface VillageCommandBuildHouseArgs {
  villageId: VillageID;
}

export interface VillageCommandHeroHireArgs {
  villageId: VillageID;
}
