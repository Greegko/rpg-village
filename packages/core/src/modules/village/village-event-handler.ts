import { injectable } from "inversify";

import { eventHandler } from "@core";

import { MapEvent, PartyEventArrivedToLocationArgs } from "@modules/map";
import { PartyID, PartyService } from "@modules/party";

import { VillageStashService } from "./village-stash-service";
import { VillageStore } from "./village-store";

@injectable()
export class VillageEventHandler {
  constructor(
    private partyService: PartyService,
    private villageStash: VillageStashService,
    private villageStore: VillageStore,
  ) {}

  @eventHandler(MapEvent.PartyArrivedToLocation)
  partyArrivedToLocation(args: PartyEventArrivedToLocationArgs) {
    if (this.isPartyArrivedToVillage(args)) {
      this.partyArrived(args);
    }
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
