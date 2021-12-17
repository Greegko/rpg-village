import { injectable } from "inversify";
import { eventHandler } from "@core/event";
import { PartyEvent, ArrivedToLocationEventArgs, PartyService, PartyID } from "@modules/party";
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
  partyArrivedToLocation(args: ArrivedToLocationEventArgs) {
    if (this.isPartyArrivedToVillage(args)) {
      this.partyArrived(args);
    }
  }

  private isPartyArrivedToVillage(args: ArrivedToLocationEventArgs): boolean {
    return this.villageStore.getState().locationId === args.locationId;
  }

  private partyArrived(args: ArrivedToLocationEventArgs) {
    this.storePartyLoot(args.partyId);
  }

  private storePartyLoot(partyId: PartyID) {
    const partyStash = this.partyService.clearPartyStash(partyId);

    this.villageStash.addResource(getResource(partyStash));
    this.villageStash.addItems(getItems(partyStash));
  }
}
