import { forEach } from "ramda";
import { injectable } from "inversify";
import { UnitStore, UnitID } from "@modules/unit";
import { PartyStore, PartyID } from "@modules/party";
import { IActivityHandler, Activity } from "@modules/activity";

export type TrainingFieldState = {
  partyId: PartyID;
};

export type TrainingFieldStateArgs = TrainingFieldState;
export type RecoverableUnit = { id: UnitID; hp: number; maxhp: number };

@injectable()
export class TrainingFieldTrainActivity implements IActivityHandler<TrainingFieldStateArgs, TrainingFieldState> {
  constructor(private unitStore: UnitStore, private partyStore: PartyStore) {}

  start({ partyId }: TrainingFieldStateArgs): TrainingFieldState {
    return {
      partyId,
    };
  }

  isRunnable(): boolean {
    return true;
  }

  execute({ state }: Activity<TrainingFieldState>): TrainingFieldState {
    const units = this.partyStore.get(state.partyId).unitIds;

    forEach(unitId => this.unitStore.gainXpUnit(unitId, 25), units);

    return state;
  }

  isDone(): boolean {
    return false;
  }

  resolve() {}
}
