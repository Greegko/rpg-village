import { injectable, inject } from 'inversify';
import { WorldMap } from '../world-map';
import { WorldStore } from '../world-store';
import { PartyID } from '../../party';
import { Activity, IActivityHandler } from '../../activity/interfaces';
import { MapLocationID } from '../interfaces';

export type ExploreState = {
  progress: number;
  locationId: MapLocationID;
};

export type ExploreStartArgs = {
  locationId: MapLocationID;
};

@injectable()
export class ExploreActivity implements IActivityHandler<ExploreStartArgs, ExploreState> {

  constructor(
    @inject('WorldMap') private worldMap: WorldMap,
    @inject('WorldStore') private worldStore: WorldStore
  ) { }

  start(partyId: PartyID, { locationId }: ExploreStartArgs): Activity<ExploreState> {
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

  execute({ state }: Activity<ExploreState>): ExploreState {
    return { ...state, progress: state.progress - 1 };
  }

  isDone({ state }: Activity<ExploreState>): boolean {
    return state.progress === 0;
  }

  resolve({ state }: Activity<ExploreState>) {
    this.worldMap.exploreLocation(state.locationId);
  }

}