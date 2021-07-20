import { injectable, inject } from "inversify";
import { evolve, dec } from "ramda";
import { PartyService, PartyID, PartyEvent } from "@modules/party";
import { IActivityHandler, Activity } from "@modules/activity";
import { EventSystem } from "@core/event";

import { MapLocationID } from "../interfaces";
import { WorldMap } from "../world-map";

export type TravelState = {
  partyId: PartyID;
  targetLocationId: MapLocationID;
  progress: number;
};

export type TravelStartArgs = {
  partyId: PartyID;
  targetLocationId: MapLocationID;
};

@injectable()
export class TravelActivity implements IActivityHandler<TravelStartArgs, TravelState> {
  constructor(
    @inject("PartyService") private partyService: PartyService,
    @inject("WorldMap") private worldMap: WorldMap,
    @inject("EventSystem") private eventSystem: EventSystem,
  ) {}

  start({ partyId, targetLocationId }: TravelStartArgs): TravelState {
    const currentLocation = this.partyService.getParty(partyId).locationId;

    return {
      partyId,
      targetLocationId,
      progress: this.worldMap.getDistance(currentLocation, targetLocationId),
    };
  }

  isRunnable({ partyId, targetLocationId }: TravelStartArgs) {
    const partyLocation = this.partyService.getParty(partyId).locationId;

    return targetLocationId !== partyLocation;
  }

  execute({ state }: Activity<TravelState>): TravelState {
    return evolve({ progress: dec }, state);
  }

  isDone({ state }: Activity<TravelState>): boolean {
    return state.progress === 0;
  }

  resolve({ state }: Activity<TravelState>) {
    this.partyService.setPartyLocation(state.partyId, state.targetLocationId);
    this.eventSystem.fire(PartyEvent.ArrivedToLocation, {
      partyId: state.partyId,
      locationId: state.targetLocationId,
    });
  }
}
