import { EventSystem } from "../../lib/event-system";
import { injectable, inject } from "inversify";
import { EventHandler } from "../../models";
import { PartyEvent, ArrivedToLocationEventArgs, PartyService, PartyID } from "../party";
import { VillageStore } from "./village-store";
import { VillageStash } from "./village-stash";
import { getResource, getItems, removeResource, removeItems, ResourceStash, ItemStash } from '../../models/stash';
import { prop, pipe } from 'ramda';
import { ActivityManager } from "../activity";
import { VillageActivity } from "./interfaces";

@injectable()
export class VillageEventHandler implements EventHandler {
  constructor(
    @inject('PartyService') private partyService: PartyService,
    @inject('VillageStash') private villageStash: VillageStash,
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
    const partyStash = this.partyService.getParty(partyId).stash;
    const partyResource = getResource(partyStash);
    const partyItems = getItems(partyStash);

    const newPartyStash = pipe(
      (stash: ResourceStash & ItemStash) => removeResource(stash, partyResource),
      (stash: ResourceStash & ItemStash) => removeItems(stash, partyItems.map(prop('id')))
    )(partyStash);

    this.partyService.updateParty(partyId, { stash: newPartyStash });

    this.villageStash.addResource(partyResource);
    this.villageStash.addItems(partyItems);
  }
}
