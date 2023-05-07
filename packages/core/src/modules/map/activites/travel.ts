import { injectable } from "inversify";
import { dec, evolve } from "rambda";

import { EventSystem } from "@core/event";

import { IActivityHandler, PartyActivity } from "@modules/activity";
import { PartyEvent, PartyID, PartyStore } from "@modules/party";

import { MapLocationID, MapLocationType } from "../interfaces";
import { MapLocationStore } from "../map-location-store";
import { MapService } from "../map-service";

type TravelState = {
  partyId: PartyID;
  targetLocationId: MapLocationID;
  progress: number;
};

type TravelStartArgs = {
  partyId: PartyID;
  targetLocationId: MapLocationID;
};

@injectable()
export class MapTravelActivity implements IActivityHandler<PartyActivity<TravelState, TravelStartArgs>> {
  constructor(
    private partyStore: PartyStore,
    private mapService: MapService,
    private eventSystem: EventSystem,
    private mapLocationStore: MapLocationStore,
  ) {}

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
    const targetLocation = this.mapLocationStore.get(targetLocationId);

    if (targetLocation.type === MapLocationType.Empty) return false;

    return targetLocationId !== partyLocation;
  }

  execute({ state }: PartyActivity<TravelState>): TravelState {
    return evolve({ progress: dec }, state);
  }

  isDone({ state }: PartyActivity<TravelState>): boolean {
    return state.progress === 0;
  }

  resolve({ state }: PartyActivity<TravelState>) {
    this.partyStore.setLocation(state.partyId, state.targetLocationId);
    this.eventSystem.fire(PartyEvent.ArrivedToLocation, {
      partyId: state.partyId,
      locationId: state.targetLocationId,
    });
  }
}
