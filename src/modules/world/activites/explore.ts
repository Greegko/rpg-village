import { injectable, inject } from 'inversify';
import { WorldMap } from '../world-map';
import { WorldStore } from '../world-store';
import { PartyID } from '../../party';
import { ActivityTask, IActivityTaskHandler } from '../../activity/interfaces';
import { TravelActivity } from './travel';
import { ExploreBattleActivity } from './explore-battle';
import { MapLocationID } from '../interfaces';

export type ExploreState = {
  progress: number;
  locationId: MapLocationID;
};

export type ExploreStartArgs = {
  locationId: MapLocationID;
};

@injectable()
export class ExploreActivity implements IActivityTaskHandler<ExploreStartArgs, ExploreState> {

  constructor(
    @inject('WorldMap') private worldMap: WorldMap,
    @inject('WorldStore') private worldStore: WorldStore,
    @inject('TravelActivity') private travelActivity: TravelActivity,
    @inject('ExploreBattleActivity') private exploreBattleActivity: ExploreBattleActivity
  ) { }

  start(partyId: PartyID, { locationId }: ExploreStartArgs): ActivityTask<ExploreState> {
    return {
      type: 'explore',
      partyId,
      state: {
        locationId,
        progress: 50
      }
    }
  }

  isRunnable(partyId: PartyID, { locationId }: ExploreStartArgs): boolean {
    const exploreLocation = this.worldStore.get(locationId);
    return !exploreLocation.explored;
  }

  getSubTask({ state, partyId }: ActivityTask<ExploreState>): ActivityTask<any> {
    if (this.travelActivity.isRunnable(partyId, { destination: state.locationId })) {
      return this.travelActivity.start(partyId, { destination: state.locationId });
    }

    if (this.exploreBattleActivity.isRunnable(partyId, { locationId: state.locationId })) {
      return this.exploreBattleActivity.start(partyId, { locationId: state.locationId });
    }

    return undefined;
  }

  execute({ state }: ActivityTask<ExploreState>): ExploreState {
    return { ...state, progress: state.progress - 1 };
  }

  isDone({ state }: ActivityTask<ExploreState>): boolean {
    return state.progress === 0;
  }

  resolve({ state }: ActivityTask<ExploreState>) {
    this.worldMap.exploreLocation(state.locationId);
  }

}