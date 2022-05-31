import { injectable } from "inversify";
import { evolve, dec } from "ramda";
import { PartyStore, PartyID, PartyEvent } from "@modules/party";
import { IActivityHandler, Activity } from "@modules/activity";
import { EventSystem } from "@core/event";

import { MapLocationID } from "../interfaces";
import { MapService } from "../map-service";

export type TravelState = {
  partyId: PartyID;
  targetLocationId: MapLocationID;
  progress: number;
};

export type TravelStartArgs = {
  partyId: PartyID;
  targetLocationId: MapLocationID;
};

@injectable()
export class MapTravelActivity implements IActivityHandler<TravelStartArgs, TravelState> {
  constructor(private partyStore: PartyStore, private mapService: MapService, private eventSystem: EventSystem) {}

  start({ partyId, targetLocationId }: TravelStartArgs): TravelState {
    const currentLocationId = this.partyStore.get(partyId).locationId;

    return {
      partyId,
      targetLocationId,
      progress: this.mapService.getDistance(currentLocationId, targetLocationId),
    };
  }

  isRunnable({ partyId, targetLocationId }: TravelStartArgs) {
    const partyLocation = this.partyStore.get(partyId).locationId;

    return targetLocationId !== partyLocation;
  }

  execute({ state }: Activity<TravelState>): TravelState {
    return evolve({ progress: dec }, state);
  }

  isDone({ state }: Activity<TravelState>): boolean {
    return state.progress === 0;
  }

  resolve({ state }: Activity<TravelState>) {
    this.partyStore.setLocation(state.partyId, state.targetLocationId);
    this.eventSystem.fire(PartyEvent.ArrivedToLocation, {
      partyId: state.partyId,
      locationId: state.targetLocationId,
    });
  }
}
