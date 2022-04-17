import { evolve, dec } from "ramda";
import { injectable } from "inversify";
import { PartyID, PartyStore } from "@modules/party";
import { Activity, IActivityHandler } from "@modules/activity";
import { Map } from "../map";
import { MapStore } from "../map-store";

export type ExploreState = {
  progress: number;
  partyId: PartyID;
};

export type ExploreStartArgs = {
  partyId: PartyID;
};

@injectable()
export class MapExploreActivity implements IActivityHandler<ExploreStartArgs, ExploreState> {
  constructor(private map: Map, private mapStore: MapStore, private partyStore: PartyStore) {}

  start({ partyId }: ExploreStartArgs): ExploreState {
    return {
      partyId,
      progress: 50,
    };
  }

  isRunnable({ partyId }: ExploreStartArgs): boolean {
    const partyLocation = this.partyStore.get(partyId).locationId;
    const exploreLocation = this.mapStore.get(partyLocation);
    return !exploreLocation.explored;
  }

  execute({ state }: Activity<ExploreState>): ExploreState {
    return evolve({ progress: dec }, state);
  }

  isDone({ state }: Activity<ExploreState>): boolean {
    return state.progress === 0;
  }

  resolve({ state }: Activity<ExploreState>) {
    this.map.exploreLocation(this.partyStore.get(state.partyId).locationId);
  }
}
