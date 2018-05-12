import { injectable, inject } from 'inversify';
import { IActivityTaskHandler, ActivityTask, UnitService, UnitID, PartyService, PartyID } from '@greegko/rpg-model';
import { filter, forEach, map } from 'ramda';
import { TravelActivity } from '../../world/activites';
import { Party } from '../../../models';
import { MapLocationID } from '../../world/interfaces';

export type VillageHealState = {
  village: MapLocationID;
};

export type VillageHealStateArgs = VillageHealState;
export type RecoverableUnit = { id: UnitID, hp: number, maxhp: number };

@injectable()
export class VillageHealActivity implements IActivityTaskHandler<VillageHealStateArgs, VillageHealState> {

  constructor(
    @inject('UnitService') private unitService: UnitService,
    @inject('PartyService') private partyService: PartyService<Party>,
    @inject('TravelActivity') private travelActivity: TravelActivity,
  ){ }

  start(partyId: PartyID, { village }: VillageHealStateArgs): ActivityTask<VillageHealState> {
    return {
      type: 'village-heal',
      partyId,
      state: {
        village
      }
    };
  }

  isRunnable(partyId: PartyID, { village }: Partial<VillageHealStateArgs>): boolean {
    const party = this.partyService.getParty(partyId);
    const recoverableUnits = this._getRecoverableUnits(partyId);
    return recoverableUnits.length > 0 && party.locationId === village;
  }

  getSubTask({ state, partyId }: ActivityTask<VillageHealState>): ActivityTask<any> {
    if (this.travelActivity.isRunnable(partyId, { destination: state.village })) {
      return this.travelActivity.start(partyId, { destination: state.village });
    }
  }

  execute({ state, partyId }: ActivityTask<VillageHealState>): VillageHealState {
    const recoverableUnits = this._getRecoverableUnits(partyId);
    forEach(
      unit => this.unitService.heal(unit.id, Math.ceil(unit.maxhp / 10)),
      recoverableUnits
    );

    return state;
  }

  isDone({ state, partyId }: ActivityTask<VillageHealState>): boolean {
    return this._getRecoverableUnits(partyId).length === 0;
  }

  resolve() {}

  private _getRecoverableUnits(partyId: PartyID): RecoverableUnit[] {
    const party = this.partyService.getParty(partyId);
    const units = map(unitId => this.unitService.getUnit(unitId), party.unitIds);
    return filter(unit => unit.hp != unit.maxhp, units);
  }

}