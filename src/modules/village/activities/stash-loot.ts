import { injectable, inject } from 'inversify';
import { PartyService, PartyID } from "../../party";
import { IActivityHandler, Activity } from '../../activity/interfaces';
import { MapLocationID } from '../../world/interfaces';
import { getResource, getItems, removeResource, removeItems, ResourceStash, ItemStash } from '../../../models/stash';
import { prop, pipe } from 'ramda';
import { VillageStash } from '../village-stash';

export type StashLootState = {
  village: MapLocationID;
};

export type StashLootStartArgs = StashLootState;

@injectable()
export class StashLootActivity implements IActivityHandler<StashLootStartArgs, StashLootState> {

  constructor(
    @inject('PartyService') private partyService: PartyService,
    @inject('VillageStash') private villageStash: VillageStash,
  ) { }

  start(partyId: PartyID, { village }: StashLootStartArgs): Activity<StashLootState> {
    return {
      type: 'stash-loot',
      partyId,
      state: {
        village
      }
    };
  }

  isRunnable(partyId: PartyID, { village }: Partial<StashLootStartArgs>): boolean {
    const party = this.partyService.getParty(partyId);

    return party.locationId === village;
  }

  execute({ state }: Activity<StashLootState>): StashLootState {
    return state;
  }

  isDone({ state }: Activity<StashLootState>): boolean {
    return true;
  }

  resolve({ state, partyId }: Activity<StashLootState>) {
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