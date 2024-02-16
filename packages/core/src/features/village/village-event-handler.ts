import { inject, injectable } from "inversify";
import { complement, inc, prop } from "rambda";

import { ModuleConfig, ModuleConfigToken, eventHandler } from "@core";

import { BattleEvent, BattleFinishedActivityArgs } from "@features/battle";
import { MapEvent, PartyEventArrivedToLocationArgs } from "@features/map";
import { PartyID, PartyService } from "@features/party";
import { isAlive } from "@features/unit";

import { VillageConfig, VillageEvent, VillageEventBuildingBuiltArgs } from "./interfaces";
import { calculateLoot, calculateXpGain } from "./lib";
import { VillageStashService } from "./village-stash-service";
import { VillageStore } from "./village-store";

@injectable()
export class VillageEventHandler {
  constructor(
    private partyService: PartyService,
    private villageStash: VillageStashService,
    private villageStore: VillageStore,
    @inject(ModuleConfigToken) private config: ModuleConfig,
  ) {}

  @eventHandler(MapEvent.PartyArrivedToLocation)
  partyArrivedToLocation(args: PartyEventArrivedToLocationArgs) {
    if (this.isPartyArrivedToVillage(args)) {
      this.partyArrived(args);
    }
  }

  @eventHandler(VillageEvent.BuildingBuilt)
  buildingBuilt(args: VillageEventBuildingBuiltArgs) {
    this.villageStore.update(args.buildingType, inc);
  }

  @eventHandler(BattleEvent.Finished)
  battleFinishedEvent({ winnerPartyId, looserPartyId }: BattleFinishedActivityArgs) {
    const winnerUnits = this.partyService.getPartyUnits(winnerPartyId);
    const looserUnits = this.partyService.getPartyUnits(looserPartyId);
    const loot = calculateLoot(looserUnits);
    const xpGain = calculateXpGain(looserUnits);

    this.partyService.gainXp(winnerPartyId, xpGain);

    if (this.config[VillageConfig.DirectLootToVillage]) {
      if (loot.resource) this.villageStash.addResource(loot.resource);
      if (loot.items) this.villageStash.addItems(loot.items);
    } else {
      this.partyService.collectLoot(winnerPartyId, loot);
    }

    const diedWinnerUnits = winnerUnits.filter(complement(isAlive));

    this.partyService.removeUnitFromParty(winnerPartyId, diedWinnerUnits.map(prop("id")));
    this.partyService.removeUnitFromParty(looserPartyId, looserUnits.map(prop("id")));

    this.partyService.disbandParty(looserPartyId);
  }

  private isPartyArrivedToVillage(args: PartyEventArrivedToLocationArgs): boolean {
    return this.villageStore.getState().locationId === args.locationId;
  }

  private partyArrived(args: PartyEventArrivedToLocationArgs) {
    this.storePartyLoot(args.partyId);
  }

  private storePartyLoot(partyId: PartyID) {
    const partyStash = this.partyService.clearPartyStash(partyId);

    this.villageStash.addItems(partyStash.items);
    this.villageStash.addResource(partyStash.resource);
  }
}
