import { injectable, inject } from 'inversify';
import { PartyService, PartyID } from '@greegko/rpg-model';
import { IActivityTaskHandler, ActivityTask } from '../../activity/interfaces';
import { WorldMap } from '../world-map';
import { Party } from '../../../models';
import { MapLocationID } from '../interfaces';
import { PartyLocationService } from '../../party';

export type TravelState = {
  destination: MapLocationID;
  progress: number;
};

export type TravelStartArgs = {
  destination: MapLocationID;
};

@injectable()
export class TravelActivity implements IActivityTaskHandler<TravelStartArgs, TravelState> {

  constructor(
    @inject('PartyService') private partyService: PartyService<Party>,
    @inject('PartyLocationService') private partyLocationService: PartyLocationService,
    @inject('WorldMap') private worldMap: WorldMap
  ) { }

  start(partyId: PartyID, { destination }: TravelStartArgs): ActivityTask<TravelState> {
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

  getSubTask(): ActivityTask<any> {
    return undefined;
  }

  execute({ state }: ActivityTask<TravelState>): TravelState {
    return { ...state, progress: state.progress - 1 };
  }

  isDone({ state }: ActivityTask<TravelState>): boolean {
    return state.progress === 0;
  }

  resolve(activity: ActivityTask<TravelState>) {
    this.partyLocationService.updateLocation(activity.partyId, activity.state.destination);
  }

}
