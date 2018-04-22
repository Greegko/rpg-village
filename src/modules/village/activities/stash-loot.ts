import { injectable, inject } from 'inversify';
import { PartyService, PartyID, LocationID, IActivityTaskHandler, ActivityTask, StashResource, StashItems } from '@greegko/rpg-model';
import { TravelActivity } from '../../world/activites';
import { Village } from '../../village';
import { Resource } from '../../../models';

export type StashLootState = {
  village: LocationID;
};

export type StashLootStartArgs = StashLootState;

@injectable()
export class StashLootActivity implements IActivityTaskHandler<StashLootStartArgs, StashLootState> {
  
  constructor(
    @inject('PartyService') private partyService: PartyService,
    @inject('StashResource') private stashResource: StashResource<Resource>,
    @inject('StashItems') private stashItems: StashItems,
    @inject('TravelActivity') private travelActivity: TravelActivity,
    @inject('Village') private village: Village,
  ){ }

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
    const stashId = this.partyService.getParty(partyId).stash;
    const items = this.stashItems.takeAllItems(stashId);
    const resource = this.stashResource.takeAllResource(stashId);

    this.village.stashResource(resource);
    this.village.stashItems(items);
  }

}