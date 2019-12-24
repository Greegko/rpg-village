import { injectable, inject } from 'inversify';
import { PartyService, PartyID, Party } from "../../party";
import { IActivityTaskHandler, ActivityTask } from '../../activity/interfaces';
import { TravelActivity } from '../../world/activites';
import { MapLocationID } from '../../world/interfaces';
import { StashResource, StashItems } from '../../stash';
import { Resource } from '../../../models';
import { VillageStore } from '../village-store';
import { PlayerStash } from '../../player';

export type StashLootState = {
  village: MapLocationID;
};

export type StashLootStartArgs = StashLootState;

@injectable()
export class StashLootActivity implements IActivityTaskHandler<StashLootStartArgs, StashLootState> {

  constructor(
    @inject('PartyService') private partyService: PartyService<Party>,
    @inject('StashResource') private stashResource: StashResource<Resource>,
    @inject('PlayerStash') private playerStash: PlayerStash,
    @inject('StashItems') private stashItems: StashItems,
    @inject('TravelActivity') private travelActivity: TravelActivity,
    @inject('VillageStore') private villageStore: VillageStore,
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
    const villageStashId = this.villageStore.getState().stashId;
    const partyStashId = this.partyService.getParty(partyId).stashId;

    const resource = this.stashResource.takeAllResource(partyStashId);
    this.playerStash.addResource(resource);

    const items = this.stashItems.takeAllItems(partyStashId);
    this.stashItems.addItems(villageStashId, items);
  }

}