import { injectable } from "inversify";
import { dec, evolve, forEach } from "ramda";

import { Activity, IActivityHandler } from "@modules/activity";
import { PartyID, PartyStore } from "@modules/party";
import { UnitID, UnitService } from "@modules/unit";

export type TrainingFieldState = {
  partyId: PartyID;
  progress: number;
};

export type TrainingFieldStateArgs = TrainingFieldState;
export type RecoverableUnit = { id: UnitID; hp: number; maxhp: number };

@injectable()
export class TrainingFieldTrainActivity implements IActivityHandler<TrainingFieldStateArgs, TrainingFieldState> {
  constructor(private unitService: UnitService, private partyStore: PartyStore) {}

  start({ partyId }: TrainingFieldStateArgs): TrainingFieldState {
    return {
      partyId,
      progress: 100,
    };
  }

  isRunnable(): boolean {
    return true;
  }

  execute({ state }: Activity<TrainingFieldState>): TrainingFieldState {
    const units = this.partyStore.get(state.partyId).unitIds;

    forEach(unitId => this.unitService.gainXpUnit(unitId, 25), units);

    return evolve({ progress: dec }, state);
  }

  isDone({ state }: Activity<TrainingFieldState>): boolean {
    return state.progress === 0;
  }

  resolve() {}
}
