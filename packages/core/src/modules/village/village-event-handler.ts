import { injectable } from "inversify";
import { EventHandler, EventSystem } from "@core/event";
import { PartyEvent, ArrivedToLocationEventArgs, PartyService, PartyID } from "@modules/party";
import { getResource, getItems } from "@models/stash";
import { VillageStore } from "./village-store";
import { VillageStashService } from "./village-stash-service";

@injectable()
export class VillageEventHandler implements EventHandler {
  constructor(
    private partyService: PartyService,
    private villageStash: VillageStashService,
    private villageStore: VillageStore,
  ) {}

  init(eventSystem: EventSystem) {
    eventSystem.on(PartyEvent.ArrivedToLocation, (args: any) => {
      if (this.isPartyArrivedToVillage(args)) {
        this.partyArrived(args);
      }
    });
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
