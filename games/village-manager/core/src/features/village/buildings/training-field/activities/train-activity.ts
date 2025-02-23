import { dec, evolve, forEach } from "rambda";

import { inject } from "@rpg-village/core";

import { Activity, ActivityHandler, injectableActivity } from "@rpg-village/features/activity";

import { PartyID, PartyStore } from "@features/party";
import { UnitService } from "@features/unit";

import { VillageID } from "../../../interfaces";
import { TrainingFieldActivity } from "../interface";

type TrainingFieldState = {
  progress: number;
};

export type TrainingFieldActivityStartArgs = { targetId: VillageID; involvedTargetId: PartyID };

type TrainingActivityType = Activity<TrainingFieldState, VillageID, PartyID, TrainingFieldActivityStartArgs>;

@injectableActivity(TrainingFieldActivity.Train)
export class TrainingFieldTrainActivity implements ActivityHandler<TrainingActivityType> {
  private unitService = inject(UnitService);
  private partyStore = inject(PartyStore);

  start(args: TrainingFieldActivityStartArgs): TrainingFieldState {
    return {
      progress: 100,
    };
  }

  isRunnable(): boolean {
    return true;
  }

  execute({ state, involvedTargetId }: TrainingActivityType): TrainingFieldState {
    const units = this.partyStore.get(involvedTargetId).unitIds;

    forEach(unitId => this.unitService.gainXpUnit(unitId, 25), units);

    return evolve({ progress: dec }, state);
  }

  isDone({ state }: TrainingActivityType): boolean {
    return state.progress === 0;
  }

  resolve() {}
}
