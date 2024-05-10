import { injectable } from "inversify";
import { evolve, values } from "remeda";

import { commandHandler } from "@rpg-village/core";
import { withoutBy } from "@rpg-village/core/lib/without-by";

import { MapMoveDirectionStore, MapStore } from "@features/map";
import { PartyStore } from "@features/party";
import { getPointDistance } from "@features/town";

import {
  VillageCommand,
  VillageCommandDisbandVillagerArgs,
  VillageCommandEnterVillageArgs,
  VillageCommandLeaveVillageArgs,
  VillageCommandSpawnVillagerArgs,
  VillageCommandTakeResourceArgs,
} from "./interface";
import { VillageStore } from "./village-store";

@injectable()
export class VillageCommandHandler {
  constructor(
    private villageStore: VillageStore,
    private mapMoveDirectionStore: MapMoveDirectionStore,
    private mapStore: MapStore,
    private partyStore: PartyStore,
  ) {}

  @commandHandler(VillageCommand.SpawnVillager)
  spawnVillager(args: VillageCommandSpawnVillagerArgs) {
    const village = this.villageStore.get(args.villageId);

    const parties = values(this.partyStore.getState());

    const villagerParty = parties.find(x => x.belongTo === village.id);
    if (villagerParty) return;

    const party = this.partyStore.add({ units: [], belongTo: village.id, stash: { gold: 0, items: [] } });
    this.villageStore.update(village.id, evolve({ parties: x => [...x, party.id] }));
  }

  @commandHandler(VillageCommand.TakeResource)
  villagerTakeResource(args: VillageCommandTakeResourceArgs) {
    const village = this.villageStore.get(args.villageId);

    const parties = values(this.partyStore.getState());

    const villagerParty = parties.find(x => x.belongTo === village.id);
    if (!villagerParty) return;

    this.villageStore.update(village.id, evolve({ stash: stash => ({ ...stash, items: [] }) }));
    this.partyStore.update(
      villagerParty.id,
      evolve({ stash: stash => ({ ...stash, items: [...stash.items, ...village.stash.items] }) }),
    );
  }

  @commandHandler(VillageCommand.DisbandVillager)
  disbandVillager(args: VillageCommandDisbandVillagerArgs) {
    const village = this.villageStore.get(args.villageId);

    const parties = values(this.partyStore.getState());

    const villagerParty = parties.find(x => x.belongTo === village.id);
    if (!villagerParty) return;

    this.partyStore.remove(villagerParty.id);
    this.villageStore.update(
      args.villageId,
      evolve({ stash: stash => ({ ...stash, gold: stash.gold + villagerParty.stash.gold }) }),
    );
  }

  @commandHandler(VillageCommand.EnterVillage)
  enterVillage(args: VillageCommandEnterVillageArgs) {
    const villagePosition = this.mapStore.get(args.villageId)!;
    const partyPosition = this.mapStore.get(args.partyId)!;

    if (getPointDistance(villagePosition, partyPosition) > 2) return;

    this.villageStore.update(args.villageId, evolve({ parties: x => [...x, args.partyId] }));
    this.mapMoveDirectionStore.remove(args.partyId);
    this.mapStore.remove(args.partyId);
  }

  @commandHandler(VillageCommand.LeaveVillage)
  leaveVillage(args: VillageCommandLeaveVillageArgs) {
    const villagePosition = this.mapStore.get(args.villageId)!;

    if (!this.villageStore.get(args.villageId).parties.includes(args.partyId)) return;

    this.villageStore.update(
      args.villageId,
      evolve({ parties: parties => withoutBy<string>(parties, [args.partyId], x => x) }),
    );

    this.mapStore.set(args.partyId, villagePosition);
  }
}
