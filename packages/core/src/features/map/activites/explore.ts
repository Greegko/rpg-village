import { injectable } from "inversify";
import { dec, evolve } from "rambda";

import { Activity, IActivityHandlerCancelable } from "@features/activity";
import { PartyID } from "@features/party";

import { MapService } from "../map-service";
import { PartyMapService } from "../party-map-service";

type ExploreState = {
  progress: number;
  partyId: PartyID;
};

type ExploreStartArgs = {
  partyId: PartyID;
};

@injectable()
export class MapExploreActivity implements IActivityHandlerCancelable<Activity<ExploreState, ExploreStartArgs>> {
  constructor(private mapService: MapService, private partyMapService: PartyMapService) {}

  start({ partyId }: ExploreStartArgs): ExploreState {
    return {
      partyId,
      progress: 50,
    };
  }

  isRunnable({ partyId }: ExploreStartArgs): boolean {
    const partyLocation = this.partyMapService.getPartyLocation(partyId);

    if (!partyLocation) return false;

    return !partyLocation.explored;
  }

  execute({ state }: Activity<ExploreState>): ExploreState {
    return evolve({ progress: dec }, state);
  }

  isDone({ state }: Activity<ExploreState>): boolean {
    return state.progress === 0;
  }

  resolve({ state }: Activity<ExploreState>) {
    this.mapService.exploreLocation(this.partyMapService.getPartyLocation(state.partyId)!.id);
  }

  isCancelable(activity: Activity<ExploreState, ExploreStartArgs>): boolean {
    return true;
  }

  onCancel(activity: Activity<ExploreState, ExploreStartArgs>): void {}
}
