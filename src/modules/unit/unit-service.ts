import { inject, injectable } from 'inversify';
import { UnitStore } from './unit-store';
import { UnitBase, UnitType, UnitID } from './interfaces';
import { WithID } from '../../../src/models';

@injectable()
export class UnitService<Unit extends UnitBase> {
  constructor(@inject('UnitStore') private unitStore: UnitStore<Unit>) { }

  createUnit(unit: Unit, type: UnitType): UnitID {
    const newUnit = this.unitStore.add({ ...unit as any, type });
    return newUnit.id;
  }

  getUnit(unitId: UnitID): WithID<Unit> {
    return this.unitStore.get(unitId);
  }

  heal(unitId: UnitID, hpGain: number): void {
    const unit = this.unitStore.get(unitId);
    this.unitStore.update(unitId, { hp: Math.min(unit.maxhp, unit.hp + hpGain) } as Partial<Unit>);
  }

}
