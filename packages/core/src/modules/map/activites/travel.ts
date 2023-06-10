import { injectable } from "inversify";
import { dec, evolve } from "rambda";

import { EventSystem } from "@core";

import { IActivityHandlerCancelable } from "@features/activity";
import { PartyActivity, PartyID } from "@features/party";

import { MapEvent, MapLocationID, MapLocationType } from "../interfaces";
import { MapLocationStore } from "../map-location-store";
import { MapService } from "../map-service";
import { PartyMapService } from "../party-map-service";

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
export class MapTravelActivity implements IActivityHandlerCancelable<PartyActivity<TravelState, TravelStartArgs>> {
  constructor(
    private mapService: MapService,
    private partyMapService: PartyMapService,
    private eventSystem: EventSystem,
    private mapLocationStore: MapLocationStore,
  ) {}

  start({ partyId, targetLocationId }: TravelStartArgs): TravelState {
    const partyLocation = this.partyMapService.getPartyLocation(partyId)!;

    return {
      partyId,
      targetLocationId,
      progress: this.mapService.getDistance(partyLocation.id, targetLocationId),
    };
  }

  isRunnable({ partyId, targetLocationId }: TravelStartArgs) {
    const partyLocation = this.partyMapService.getPartyLocation(partyId);

    if (!partyLocation) return false;

    const targetLocation = this.mapLocationStore.get(targetLocationId);

    if (targetLocation.type === MapLocationType.Empty) return false;

    return targetLocationId !== partyLocation.id;
  }

  execute({ state }: PartyActivity<TravelState>): TravelState {
    return evolve({ progress: dec }, state);
  }

  isDone({ state }: PartyActivity<TravelState>): boolean {
    return state.progress === 0;
  }

  resolve({ state }: PartyActivity<TravelState>) {
    this.partyMapService.setLocation(state.partyId, state.targetLocationId);
    this.eventSystem.fire(MapEvent.PartyArrivedToLocation, {
      partyId: state.partyId,
      locationId: state.targetLocationId,
    });
  }

  isCancelable(activity: PartyActivity<TravelState, TravelStartArgs>): boolean {
    return true;
  }

  onCancel(activity: PartyActivity<TravelState, TravelStartArgs>): void {}
}
