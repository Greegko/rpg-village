import { dec, evolve } from "rambda";

import { inject, injectable } from "@rpg-village/core";
import { EventSystem } from "@rpg-village/core";

import { Activity, ActivityHandlerCancelable } from "@rpg-village/features/activity";

import { PartyID } from "@features/party";

import { MapEvent, MapLocationID, MapLocationType } from "../interfaces";
import { MapLocationStore } from "../map-location-store";
import { MapService } from "../map-service";
import { PartyMapService } from "../party-map-service";

type TravelState = {
  targetLocationId: MapLocationID;
  progress: number;
};

export type MapActivityTravelStartArgs = {
  targetId: PartyID;
  targetLocationId: MapLocationID;
};

@injectable()
export class MapTravelActivity implements ActivityHandlerCancelable<Activity<TravelState, PartyID, null, MapActivityTravelStartArgs>> {
  private mapService = inject(MapService);
  private partyMapService = inject(PartyMapService);
  private eventSystem = inject(EventSystem);
  private mapLocationStore = inject(MapLocationStore);

  start({ targetId, targetLocationId }: MapActivityTravelStartArgs): TravelState {
    const partyLocation = this.partyMapService.getPartyLocation(targetId)!;

    return {
      targetLocationId,
      progress: this.mapService.getDistance(partyLocation.id, targetLocationId),
    };
  }

  isRunnable({ targetId, targetLocationId }: MapActivityTravelStartArgs) {
    const partyLocation = this.partyMapService.getPartyLocation(targetId);

    if (!partyLocation) return false;

    const targetLocation = this.mapLocationStore.get(targetLocationId);

    if (targetLocation.type === MapLocationType.Empty) return false;

    return targetLocationId !== partyLocation.id;
  }

  execute({ state }: Activity<TravelState, PartyID, null, MapActivityTravelStartArgs>): TravelState {
    return evolve({ progress: dec }, state);
  }

  isDone({ state }: Activity<TravelState, PartyID, null, MapActivityTravelStartArgs>): boolean {
    return state.progress === 0;
  }

  resolve({ state, targetId }: Activity<TravelState, PartyID, null, MapActivityTravelStartArgs>) {
    this.partyMapService.setLocation(targetId, state.targetLocationId);
    this.eventSystem.fire(MapEvent.PartyArrivedToLocation, {
      partyId: targetId,
      locationId: state.targetLocationId,
    });
  }

  isCancelable(activity: Activity<TravelState, PartyID, null, MapActivityTravelStartArgs>): boolean {
    return true;
  }

  onCancel(activity: Activity<TravelState, PartyID, null, MapActivityTravelStartArgs>): void {}
}
