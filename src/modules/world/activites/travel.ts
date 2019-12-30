import { injectable, inject } from 'inversify';
import { PartyService, PartyID, PartyLocationService } from '../../party';
import { IActivityHandler, Activity } from '../../activity/interfaces';
import { WorldMap } from '../world-map';
import { MapLocationID } from '../interfaces';

export type TravelState = {
  destination: MapLocationID;
  progress: number;
};

export type TravelStartArgs = {
  destination: MapLocationID;
};

@injectable()
export class TravelActivity implements IActivityHandler<TravelStartArgs, TravelState> {

  constructor(
    @inject('PartyService') private partyService: PartyService,
    @inject('PartyLocationService') private partyLocationService: PartyLocationService,
    @inject('WorldMap') private worldMap: WorldMap
  ) { }

  start(partyId: PartyID, { destination }: TravelStartArgs): Activity<TravelState> {
    const currentLocation = this.partyService.getParty(partyId).locationId;

    return {
      type: 'travel',
      partyId,
      state: {
        destination,
        progress: this.worldMap.getDistance(currentLocation, destination)
      }
    };
  }

  isRunnable(partyId: PartyID, { destination }: TravelStartArgs) {
    const partyLocation = this.partyService.getParty(partyId).locationId;

    return destination !== partyLocation;
  }

  execute({ state }: Activity<TravelState>): TravelState {
    return { ...state, progress: state.progress - 1 };
  }

  isDone({ state }: Activity<TravelState>): boolean {
    return state.progress === 0;
  }

  resolve(activity: Activity<TravelState>) {
    this.partyLocationService.updateLocation(activity.partyId, activity.state.destination);
  }

}
