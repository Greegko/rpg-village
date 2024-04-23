import { injectable } from "inversify";
import { values } from "remeda";

import { commandHandler } from "@rpg-village/core";

import { MapStore } from "@features/map";
import { PartyStore } from "@features/party";

import { VillageCommand, VillageCommandSpawnVillagerArgs } from "./interface";
import { VillageStore } from "./village-store";

@injectable()
export class VillageCommandHandler {
  constructor(private villageStore: VillageStore, private mapStore: MapStore, private partyStore: PartyStore) {}

  @commandHandler(VillageCommand.SpawnVillager)
  spawnVillager(args: VillageCommandSpawnVillagerArgs) {
    const village = this.villageStore.get(args.villageId);

    const parties = values(this.partyStore.getState());

    const villageParty = parties.find(x => x.belongTo === village.id);
    if (villageParty) return;

    const party = this.partyStore.add({ units: [], belongTo: village.id, stash: { gold: 0, items: [] } });
    const villagePosition = this.mapStore.get(village.id)!;
    this.mapStore.set(party.id, villagePosition);
  }
}
