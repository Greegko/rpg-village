import { EventSystem } from "../../lib/event-system";
import { injectable, inject } from "inversify";
import { EventHandler } from "../../models";
import { PartyEvent, ArrivedToLocationEventArgs, PartyService, PartyID } from "../party";
import { VillageStore } from "./village-store";
import { VillageStashService } from "./village-stash-service";
import { getResource, getItems } from '../../models/stash';
import { ActivityManager } from "../activity";
import { VillageActivity } from "./interfaces";

@injectable()
export class VillageEventHandler implements EventHandler {
  constructor(
    @inject('PartyService') private partyService: PartyService,
    @inject('VillageStashService') private villageStash: VillageStashService,
    @inject('VillageStore') private villageStore: VillageStore,
    @inject('ActivityManager') private activityManager: ActivityManager,
  ) { }

  init(eventSystem: EventSystem) {
    eventSystem.on(PartyEvent.ArrivedToLocation, args => {
      if (this.isPartyArrivedToVillage(args)) {
        this.partyArrived(args);
      }
    });
  }

  private isPartyArrivedToVillage(args: ArrivedToLocationEventArgs): boolean {
    return this.villageStore.getState().locationId === args.locationId;
  }

  private partyArrived(args: ArrivedToLocationEventArgs) {
    this.activityManager.startActivity(VillageActivity.Heal, { partyId: args.partyId });
    this.storePartyLoot(args.partyId);
  }

  private storePartyLoot(partyId: PartyID) {
    const partyStash = this.partyService.clearPartyStash(partyId);

    this.villageStash.addResource(getResource(partyStash));
    this.villageStash.addItems(getItems(partyStash));
  }
}
