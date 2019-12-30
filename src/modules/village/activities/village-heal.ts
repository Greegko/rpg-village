import { injectable, inject } from 'inversify';
import { UnitService, UnitID } from "../../unit";
import { PartyService, PartyID } from "../../party";
import { IActivityHandler, Activity } from '../../activity';
import { filter, forEach, map } from 'ramda';
import { MapLocationID } from '../../world/interfaces';

export type VillageHealState = {
  village: MapLocationID;
};

export type VillageHealStateArgs = VillageHealState;
export type RecoverableUnit = { id: UnitID, hp: number, maxhp: number };

@injectable()
export class VillageHealActivity implements IActivityHandler<VillageHealStateArgs, VillageHealState> {

  constructor(
    @inject('UnitService') private unitService: UnitService,
    @inject('PartyService') private partyService: PartyService,
  ) { }

  start(partyId: PartyID, { village }: VillageHealStateArgs): Activity<VillageHealState> {
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

  execute({ state, partyId }: Activity<VillageHealState>): VillageHealState {
    const recoverableUnits = this._getRecoverableUnits(partyId);
    forEach(
      unit => this.unitService.heal(unit.id, Math.ceil(unit.maxhp / 10)),
      recoverableUnits
    );

    return state;
  }

  isDone({ state, partyId }: Activity<VillageHealState>): boolean {
    return this._getRecoverableUnits(partyId).length === 0;
  }

  resolve() { }

  private _getRecoverableUnits(partyId: PartyID): RecoverableUnit[] {
    const party = this.partyService.getParty(partyId);
    const units = map(unitId => this.unitService.getUnit(unitId), party.unitIds);
    return filter(unit => unit.hp !== unit.maxhp, units);
  }

}