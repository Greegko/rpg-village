import { injectable } from "inversify";
import { dec, evolve } from "rambda";

import { IActivityHandlerCancelable, PartyActivity } from "@modules/activity";
import { PartyID, PartyStore } from "@modules/party";

import { MapLocationStore } from "../map-location-store";
import { MapService } from "../map-service";

type ExploreState = {
  progress: number;
  partyId: PartyID;
};

type ExploreStartArgs = {
  partyId: PartyID;
};

@injectable()
export class MapExploreActivity implements IActivityHandlerCancelable<PartyActivity<ExploreState, ExploreStartArgs>> {
  constructor(
    private mapService: MapService,
    private mapLocationStore: MapLocationStore,
    private partyStore: PartyStore,
  ) {}

  start({ partyId }: ExploreStartArgs): ExploreState {
    return {
      partyId,
      progress: 50,
    };
  }

  isRunnable({ partyId }: ExploreStartArgs): boolean {
    const partyLocation = this.partyStore.get(partyId).locationId;
    const exploreLocation = this.mapLocationStore.get(partyLocation);
    return !exploreLocation.explored;
  }

  execute({ state }: PartyActivity<ExploreState>): ExploreState {
    return evolve({ progress: dec }, state);
  }

  isDone({ state }: PartyActivity<ExploreState>): boolean {
    return state.progress === 0;
  }

  resolve({ state }: PartyActivity<ExploreState>) {
    this.mapService.exploreLocation(this.partyStore.get(state.partyId).locationId);
  }

  isCancelable(activity: PartyActivity<ExploreState, ExploreStartArgs>): boolean {
    return true;
  }

  onCancel(activity: PartyActivity<ExploreState, ExploreStartArgs>): void {}
}
