import { evolve, dec } from "ramda";
import { injectable } from "inversify";
import { PartyID, PartyService } from "@modules/party";
import { Activity, IActivityHandler } from "@modules/activity";
import { WorldMap } from "../world-map";
import { WorldStore } from "../world-store";

export type ExploreState = {
  progress: number;
  partyId: PartyID;
};

export type ExploreStartArgs = {
  partyId: PartyID;
};

@injectable()
export class ExploreActivity implements IActivityHandler<ExploreStartArgs, ExploreState> {
  constructor(
    private worldMap: WorldMap,
    private worldStore: WorldStore,
    private partyService: PartyService,
  ) {}

  start({ partyId }: ExploreStartArgs): ExploreState {
    return {
      partyId,
      progress: 50,
    };
  }

  isRunnable({ partyId }: ExploreStartArgs): boolean {
    const partyLocation = this.partyService.getParty(partyId).locationId;
    const exploreLocation = this.worldStore.get(partyLocation);
    return !exploreLocation.explored;
  }

  execute({ state }: Activity<ExploreState>): ExploreState {
    return evolve({ progress: dec }, state);
  }

  isDone({ state }: Activity<ExploreState>): boolean {
    return state.progress === 0;
  }

  resolve({ state }: Activity<ExploreState>) {
    this.worldMap.exploreLocation(this.partyService.getParty(state.partyId).locationId);
  }
}
