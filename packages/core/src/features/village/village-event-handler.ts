import { injectable } from "inversify";
import { complement, prop, values } from "rambda";

import { eventHandler } from "@core";

import { BattleEvent, BattleFinishedActivityArgs } from "@features/battle";
import { MapEvent, PartyEventArrivedToLocationArgs } from "@features/map";
import { PartyService } from "@features/party";
import { isAlive } from "@features/unit";

import { calculateLoot, calculateXpGain } from "./lib";
import { VillageService } from "./village-service";
import { VillageStore } from "./village-store";

@injectable()
export class VillageEventHandler {
  constructor(
    private partyService: PartyService,
    private villageService: VillageService,
    private villageStore: VillageStore,
  ) {}

  @eventHandler(MapEvent.PartyArrivedToLocation)
  partyArrivedToLocation(args: PartyEventArrivedToLocationArgs) {
    const villages = values(this.villageStore.getState());
    const arrivedToVillage = villages.find(x => x.locationId === args.locationId);

    if (!arrivedToVillage) return;

    const partyStash = this.partyService.takePartyStash(args.partyId);

    const villageStash = this.villageService.getStash(arrivedToVillage.id);

    villageStash.addItems(partyStash.items);
    villageStash.addResource(partyStash.resource);
  }

  @eventHandler(BattleEvent.Finished)
  battleFinishedEvent({ winnerPartyId, looserPartyId }: BattleFinishedActivityArgs) {
    const winnerUnits = this.partyService.getPartyUnits(winnerPartyId);
    const looserUnits = this.partyService.getPartyUnits(looserPartyId);
    const loot = calculateLoot(looserUnits);
    const xpGain = calculateXpGain(looserUnits);

    this.partyService.gainXp(winnerPartyId, xpGain);

    this.partyService.collectLoot(winnerPartyId, loot);

    const diedWinnerUnits = winnerUnits.filter(complement(isAlive));

    this.partyService.removeUnitFromParty(winnerPartyId, diedWinnerUnits.map(prop("id")));
    this.partyService.removeUnitFromParty(looserPartyId, looserUnits.map(prop("id")));

    this.partyService.disbandParty(looserPartyId);
  }
}
