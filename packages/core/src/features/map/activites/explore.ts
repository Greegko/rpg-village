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

export type MapActivityExploreStartArgs = {
  partyId: PartyID;
};

@injectable()
export class MapExploreActivity
  implements IActivityHandlerCancelable<Activity<ExploreState, MapActivityExploreStartArgs>>
{
  constructor(private mapService: MapService, private partyMapService: PartyMapService) {}

  start({ partyId }: MapActivityExploreStartArgs): ExploreState {
    return {
      partyId,
      progress: 50,
    };
  }

  isRunnable({ partyId }: MapActivityExploreStartArgs): boolean {
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

  isCancelable(activity: Activity<ExploreState, MapActivityExploreStartArgs>): boolean {
    return true;
  }

  onCancel(activity: Activity<ExploreState, MapActivityExploreStartArgs>): void {}
}
