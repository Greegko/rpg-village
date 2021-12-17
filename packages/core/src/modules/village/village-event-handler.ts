import { injectable } from "inversify";
import { eventHandler } from "@core/event";
import { PartyEvent, PartyEventArrivedToLocationArgs, PartyService, PartyID } from "@modules/party";
import { getResource, getItems } from "@models/stash";
import { VillageStore } from "./village-store";
import { VillageStashService } from "./village-stash-service";

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
