import { injectable } from "inversify";
import { dec, evolve, forEach } from "rambda";

import { Activity, IActivityHandler } from "@features/activity";
import { PartyID, PartyStore } from "@features/party";
import { UnitService } from "@features/unit";

type TrainingFieldState = {
  partyId: PartyID;
  progress: number;
};

export type TrainingFieldActivityStartArgs = { partyId: PartyID };

@injectable()
export class TrainingFieldTrainActivity
  implements IActivityHandler<Activity<TrainingFieldState, TrainingFieldActivityStartArgs>>
{
  constructor(private unitService: UnitService, private partyStore: PartyStore) {}

  start({ partyId }: TrainingFieldActivityStartArgs): TrainingFieldState {
    return {
      partyId,
      progress: 100,
    };
  }

  isRunnable(): boolean {
    return true;
  }

  execute({ state }: Activity<TrainingFieldState, TrainingFieldActivityStartArgs>): TrainingFieldState {
    const units = this.partyStore.get(state.partyId).unitIds;

    forEach(unitId => this.unitService.gainXpUnit(unitId, 25), units);

    return evolve({ progress: dec }, state);
  }

  isDone({ state }: Activity<TrainingFieldState, TrainingFieldActivityStartArgs>): boolean {
    return state.progress === 0;
  }

  resolve() {}
}
