import { injectable, inject } from 'inversify';
import { WorldMap } from '../world-map';
import { WorldStore } from '../world-store';
import { PartyID } from '../../party';
import { Activity, IActivityHandler } from '../../activity/interfaces';
import { MapLocationID } from '../interfaces';
import { evolve, dec } from 'ramda';

export type ExploreState = {
  progress: number;
  partyId: PartyID;
  locationId: MapLocationID;
};

export type ExploreStartArgs = {
  partyId: PartyID;
  locationId: MapLocationID;
};

@injectable()
export class ExploreActivity implements IActivityHandler<ExploreStartArgs, ExploreState> {

  constructor(
    @inject('WorldMap') private worldMap: WorldMap,
    @inject('WorldStore') private worldStore: WorldStore
  ) { }

  start({ partyId, locationId }: ExploreStartArgs): ExploreState {
    return {
      partyId,
      locationId,
      progress: 50
    }
  }

  isRunnable({ partyId, locationId }: ExploreStartArgs): boolean {
    const exploreLocation = this.worldStore.get(locationId);
    return !exploreLocation.explored;
  }

  execute({ state }: Activity<ExploreState>): ExploreState {
    return evolve({ progress: dec }, state);
  }

  isDone({ state }: Activity<ExploreState>): boolean {
    return state.progress === 0;
  }

  resolve({ state }: Activity<ExploreState>) {
    this.worldMap.exploreLocation(state.locationId);
  }

}