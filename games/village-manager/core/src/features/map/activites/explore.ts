import { dec, evolve } from "rambda";

import { inject } from "@rpg-village/core";

import { Activity, ActivityHandlerCancelable, injectableActivity } from "@rpg-village/features/activity";

import { PartyID } from "@features/party";

import { MapActivity } from "../interfaces";
import { MapService } from "../map-service";
import { PartyMapService } from "../party-map-service";

type ExploreState = {
  progress: number;
};

export type MapActivityExploreStartArgs = {
  targetId: PartyID;
};

type MapExploreActivityType = Activity<ExploreState, PartyID, null, MapActivityExploreStartArgs>;

@injectableActivity(MapActivity.Explore)
export class MapExploreActivity implements ActivityHandlerCancelable<MapExploreActivityType> {
  private mapService = inject(MapService);
  private partyMapService = inject(PartyMapService);

  start(args: MapActivityExploreStartArgs): ExploreState {
    return {
      progress: 50,
    };
  }

  isRunnable({ targetId }: MapActivityExploreStartArgs): boolean {
    const partyLocation = this.partyMapService.getPartyLocation(targetId);

    if (!partyLocation) return false;

    return !partyLocation.explored;
  }

  execute({ state }: MapExploreActivityType): ExploreState {
    return evolve({ progress: dec }, state);
  }

  isDone({ state }: MapExploreActivityType): boolean {
    return state.progress === 0;
  }

  resolve({ targetId }: MapExploreActivityType) {
    this.mapService.exploreLocation(this.partyMapService.getPartyLocation(targetId)!.id);
  }

  isCancelable(activity: MapExploreActivityType): boolean {
    return true;
  }

  onCancel(activity: MapExploreActivityType): void {}
}
