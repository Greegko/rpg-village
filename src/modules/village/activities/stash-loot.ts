import { injectable, inject } from 'inversify';
import { PartyService, PartyID } from "../../party";
import { IActivityTaskHandler, ActivityTask } from '../../activity/interfaces';
import { TravelActivity } from '../../world/activites';
import { MapLocationID } from '../../world/interfaces';
import { getResource, getItems, removeResource, removeItems, ResourceStash, ItemStash } from '../../../models/stash';
import { prop, pipe } from 'ramda';
import { VillageStash } from '../village-stash';

export type StashLootState = {
  village: MapLocationID;
};

export type StashLootStartArgs = StashLootState;

@injectable()
export class StashLootActivity implements IActivityTaskHandler<StashLootStartArgs, StashLootState> {

  constructor(
    @inject('PartyService') private partyService: PartyService,
    @inject('VillageStash') private villageStash: VillageStash,
    @inject('TravelActivity') private travelActivity: TravelActivity,
  ) { }

  start(partyId: PartyID, { village }: StashLootStartArgs): ActivityTask<StashLootState> {
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

  getSubTask({ state, partyId }: ActivityTask<StashLootState>): ActivityTask<any> {
    if (this.travelActivity.isRunnable(partyId, { destination: state.village })) {
      return this.travelActivity.start(partyId, { destination: state.village });
    }
  }

  execute({ state }: ActivityTask<StashLootState>): StashLootState {
    return state;
  }

  isDone({ state }: ActivityTask<StashLootState>): boolean {
    return true;
  }

  resolve({ state, partyId }: ActivityTask<StashLootState>) {
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