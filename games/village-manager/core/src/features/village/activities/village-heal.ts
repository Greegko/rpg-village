import { filter, forEach, map } from "rambda";

import { inject } from "@rpg-village/core";

import { Activity, ActivityHandlerCancelable, injectableActivity } from "@rpg-village/features/activity";

import { PartyID, PartyStore } from "@features/party";
import { UnitID, UnitService, UnitStore } from "@features/unit";

import { VillageActivity, VillageID } from "../interfaces";

type VillageHealState = {};

export type VillageActivityHealStartArgs = {
  targetId: VillageID;
  involvedTargetId: PartyID;
};

type RecoverableUnit = { id: UnitID; hp: number; maxhp: number };

type VillageHealActivityType = Activity<{}, VillageID, PartyID, VillageActivityHealStartArgs>;

@injectableActivity(VillageActivity.Heal)
export class VillageActivityHeal implements ActivityHandlerCancelable<VillageHealActivityType> {
  private unitStore = inject(UnitStore);
  private unitService = inject(UnitService);
  private partyStore = inject(PartyStore);

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
