import { PartyID } from "@features/party";

import { VillageID } from "./village";

export interface VillageCommandSpawnVillagerArgs {
  villageId: VillageID;
}

export interface VillageCommandDisbandVillagerArgs {
  villageId: VillageID;
  villagerId: PartyID;
}

export interface VillageCommandEnterVillageArgs {
  villageId: VillageID;
  partyId: PartyID;
}

export interface VillageCommandLeaveVillageArgs {
  villageId: VillageID;
  partyId: PartyID;
}

export interface VillageCommandTakeResourceArgs {
  villageId: VillageID;
  villagerId: PartyID;
}

export enum VillageCommand {
  SpawnVillager = "village/spawn-villager",
  TakeResource = "village/take-resource",
  DisbandVillager = "village/disband-vilalger",
  EnterVillage = "village/enter-village",
  LeaveVillage = "village/leave-village",
}
