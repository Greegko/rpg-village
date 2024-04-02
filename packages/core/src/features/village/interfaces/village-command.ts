import { PartyID } from "@features/party";

import { VillageID } from "./village";

export enum VillageCommand {
  HireHero = "village/hire-unit",
  HealParty = "village/heal",
}

export interface VillageCommandHealPartyArgs {
  villageId: VillageID;
  partyId: PartyID;
}

export interface VillageCommandHeroHireArgs {
  villageId: VillageID;
}
