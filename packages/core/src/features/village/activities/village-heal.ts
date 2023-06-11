import { injectable } from "inversify";
import { filter, forEach, map } from "rambda";

import { IActivityHandlerCancelable } from "@features/activity";
import { PartyActivity, PartyID, PartyStore } from "@features/party";
import { UnitID, UnitService, UnitStore } from "@features/unit";

type VillageHealState = {
  partyId: PartyID;
};

type VillageHealStartArgs = {
  partyId: PartyID;
};

type RecoverableUnit = { id: UnitID; hp: number; maxhp: number };

@injectable()
export class VillageHealActivity
  implements IActivityHandlerCancelable<PartyActivity<VillageHealState, VillageHealStartArgs>>
{
  constructor(private unitStore: UnitStore, private unitService: UnitService, private partyStore: PartyStore) {}

  start({ partyId }: VillageHealStartArgs): VillageHealState {
    return {
      partyId,
    };
  }

  isRunnable({ partyId }: VillageHealStartArgs): boolean {
    return this.getRecoverableUnits(partyId).length > 0;
  }

  execute({ state }: PartyActivity<VillageHealState>): VillageHealState {
    const recoverableUnits = this.getRecoverableUnits(state.partyId);

    forEach(unit => this.unitService.healUnit(unit.id, Math.ceil(unit.maxhp / 10)), recoverableUnits);

    return state;
  }

  isDone({ state: { partyId } }: PartyActivity<VillageHealState>): boolean {
    return this.getRecoverableUnits(partyId).length === 0;
  }

  resolve() {}

  isCancelable(activity: PartyActivity<VillageHealState, VillageHealStartArgs>): boolean {
    return true;
  }

  onCancel(activity: PartyActivity<VillageHealState, VillageHealStartArgs>): void {}

  private getRecoverableUnits(partyId: PartyID): RecoverableUnit[] {
    const party = this.partyStore.get(partyId);
    const units = map(unitId => this.unitStore.get(unitId), party.unitIds);
    return filter(unit => unit.hp < unit.maxhp && unit.hp > 0, units);
  }
}
