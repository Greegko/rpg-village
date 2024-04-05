import { injectable } from "inversify";
import { filter, forEach, map } from "rambda";

import { Activity, ActivityHandlerCancelable } from "@features/activity";
import { PartyID, PartyStore } from "@features/party";
import { UnitID, UnitService, UnitStore } from "@features/unit";

import { VillageID } from "../interfaces";

type VillageHealState = {};

export type VillageActivityHealStartArgs = {
  targetId: VillageID;
  involvedTargetId: PartyID;
};

type RecoverableUnit = { id: UnitID; hp: number; maxhp: number };

type VillageHealActivityType = Activity<{}, VillageID, PartyID, VillageActivityHealStartArgs>;

@injectable()
export class VillageActivityHeal implements ActivityHandlerCancelable<VillageHealActivityType> {
  constructor(private unitStore: UnitStore, private unitService: UnitService, private partyStore: PartyStore) {}

  start(args: VillageActivityHealStartArgs): VillageHealState {
    return {};
  }

  isRunnable({ involvedTargetId }: VillageActivityHealStartArgs): boolean {
    return this.getRecoverableUnits(involvedTargetId).length > 0;
  }

  execute({ involvedTargetId }: VillageHealActivityType): VillageHealState {
    const recoverableUnits = this.getRecoverableUnits(involvedTargetId);

    forEach(unit => this.unitService.healUnit(unit.id, Math.ceil(unit.maxhp / 10)), recoverableUnits);

    return {};
  }

  isDone({ involvedTargetId }: VillageHealActivityType): boolean {
    return this.getRecoverableUnits(involvedTargetId).length === 0;
  }

  resolve() {}

  isCancelable(activity: VillageHealActivityType): boolean {
    return true;
  }

  onCancel(activity: VillageHealActivityType): void {}

  private getRecoverableUnits(partyId: PartyID): RecoverableUnit[] {
    const party = this.partyStore.get(partyId);
    const units = map(unitId => this.unitStore.get(unitId), party.unitIds);
    return filter(unit => unit.hp < unit.maxhp && unit.hp > 0, units);
  }
}
