import { filter, forEach, map } from "ramda";
import { injectable } from "inversify";
import { UnitStore, UnitID } from "@modules/unit";
import { PartyStore, PartyID } from "@modules/party";
import { IActivityHandler, Activity } from "@modules/activity";

export type VillageHealState = {
  partyId: PartyID;
};

export type VillageHealStateArgs = VillageHealState;
export type RecoverableUnit = { id: UnitID; hp: number; maxhp: number };

@injectable()
export class VillageHealActivity implements IActivityHandler<VillageHealStateArgs, VillageHealState> {
  constructor(private unitStore: UnitStore, private partyStore: PartyStore) {}

  start({ partyId }: VillageHealStateArgs): VillageHealState {
    return {
      partyId,
    };
  }

  isRunnable({ partyId }: VillageHealStateArgs): boolean {
    return this.getRecoverableUnits(partyId).length > 0;
  }

  execute({ state }: Activity<VillageHealState>): VillageHealState {
    const recoverableUnits = this.getRecoverableUnits(state.partyId);

    forEach(unit => this.unitStore.healUnit(unit.id, Math.ceil(unit.maxhp / 10)), recoverableUnits);

    return state;
  }

  isDone({ state: { partyId } }: Activity<VillageHealState>): boolean {
    return this.getRecoverableUnits(partyId).length === 0;
  }

  resolve() {}

  private getRecoverableUnits(partyId: PartyID): RecoverableUnit[] {
    const party = this.partyStore.get(partyId);
    const units = map(unitId => this.unitStore.get(unitId), party.unitIds);
    return filter(unit => unit.hp < unit.maxhp && unit.hp > 0, units);
  }
}
