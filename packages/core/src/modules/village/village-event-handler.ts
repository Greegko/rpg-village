import { getItems, getResource } from "@models/stash";
import { injectable } from "inversify";

import { eventHandler } from "@core/event";

import { PartyEvent, PartyEventArrivedToLocationArgs, PartyID, PartyService } from "@modules/party";

import { VillageStashService } from "./village-stash-service";
import { VillageStore } from "./village-store";

@injectable()
export class VillageEventHandler {
  constructor(
    private partyService: PartyService,
    private villageStash: VillageStashService,
    private villageStore: VillageStore,
  ) {}

  @eventHandler(PartyEvent.ArrivedToLocation)
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

    this.villageStash.addResource(getResource(partyStash));
    this.villageStash.addItems(getItems(partyStash));
  }
}
