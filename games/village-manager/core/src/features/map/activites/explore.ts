import { injectable } from "inversify";
import { dec, evolve } from "rambda";

import { Activity, ActivityHandlerCancelable } from "@rpg-village/features/activity";

import { PartyID } from "@features/party";

import { MapService } from "../map-service";
import { PartyMapService } from "../party-map-service";

type ExploreState = {
  progress: number;
};

export type MapActivityExploreStartArgs = {
  targetId: PartyID;
};

type MapExploreActivityType = Activity<ExploreState, PartyID, null, MapActivityExploreStartArgs>;

@injectable()
export class MapExploreActivity implements ActivityHandlerCancelable<MapExploreActivityType> {
  constructor(private mapService: MapService, private partyMapService: PartyMapService) {}

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
