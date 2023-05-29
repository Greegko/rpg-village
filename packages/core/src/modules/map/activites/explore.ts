import { injectable } from "inversify";
import { dec, evolve } from "rambda";

import { IActivityHandlerCancelable } from "@modules/activity";
import { PartyActivity, PartyID } from "@modules/party";

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
export class MapExploreActivity implements IActivityHandlerCancelable<PartyActivity<ExploreState, ExploreStartArgs>> {
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

  execute({ state }: PartyActivity<ExploreState>): ExploreState {
    return evolve({ progress: dec }, state);
  }

  isDone({ state }: PartyActivity<ExploreState>): boolean {
    return state.progress === 0;
  }

  resolve({ state }: PartyActivity<ExploreState>) {
    this.mapService.exploreLocation(this.partyMapService.getPartyLocation(state.partyId)!.id);
  }

  isCancelable(activity: PartyActivity<ExploreState, ExploreStartArgs>): boolean {
    return true;
  }

  onCancel(activity: PartyActivity<ExploreState, ExploreStartArgs>): void {}
}
