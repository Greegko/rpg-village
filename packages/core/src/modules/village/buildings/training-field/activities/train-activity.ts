import { injectable } from "inversify";
import { dec, evolve, forEach } from "ramda";

import { PartyActivity, IActivityHandler } from "@modules/activity";
import { PartyID, PartyStore } from "@modules/party";
import { UnitService } from "@modules/unit";

type TrainingFieldState = {
  partyId: PartyID;
  progress: number;
};

type TrainingFieldStartArgs = TrainingFieldState;

@injectable()
export class TrainingFieldTrainActivity implements IActivityHandler<PartyActivity<TrainingFieldState, TrainingFieldStartArgs>> {
  constructor(private unitService: UnitService, private partyStore: PartyStore) {}

  start({ partyId }: TrainingFieldStartArgs): TrainingFieldState {
    return {
      partyId,
      progress: 100,
    };
  }

  isRunnable(): boolean {
    return true;
  }

  execute({ state }: PartyActivity<TrainingFieldState, TrainingFieldStartArgs>): TrainingFieldState {
    const units = this.partyStore.get(state.partyId).unitIds;

    forEach(unitId => this.unitService.gainXpUnit(unitId, 25), units);

    return evolve({ progress: dec }, state);
  }

  isDone({ state }: PartyActivity<TrainingFieldState, TrainingFieldStartArgs>): boolean {
    return state.progress === 0;
  }

  resolve() {}
}
