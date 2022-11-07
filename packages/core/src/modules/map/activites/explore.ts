import { injectable } from "inversify";
import { dec, evolve } from "ramda";

import { Activity, IActivityHandler } from "@modules/activity";
import { PartyID, PartyStore } from "@modules/party";

import { MapLocationStore } from "../map-location-store";
import { MapService } from "../map-service";

export type ExploreState = {
  progress: number;
  partyId: PartyID;
};

export type ExploreStartArgs = {
  partyId: PartyID;
};

@injectable()
export class MapExploreActivity implements IActivityHandler<Activity<ExploreState, ExploreStartArgs>> {
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

  execute({ state }: Activity<ExploreState>): ExploreState {
    return evolve({ progress: dec }, state);
  }

  isDone({ state }: Activity<ExploreState>): boolean {
    return state.progress === 0;
  }

  resolve({ state }: Activity<ExploreState>) {
    this.mapService.exploreLocation(this.partyStore.get(state.partyId).locationId);
  }
}
