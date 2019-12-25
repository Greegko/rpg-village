import { inject, injectable } from 'inversify';
import { UnitStore } from './unit-store';
import { UnitID, Unit } from './interfaces';
import { WithID } from '../../../src/models';

@injectable()
export class UnitService {
  constructor(@inject('UnitStore') private unitStore: UnitStore) { }

  createUnit(unit: Unit): UnitID {
    const newUnit = this.unitStore.add({ ...unit });
    return newUnit.id;
  }

  getUnit(unitId: UnitID): WithID<Unit> {
    return this.unitStore.get(unitId);
  }

  heal(unitId: UnitID, hpGain: number): void {
    const unit = this.unitStore.get(unitId);
    this.unitStore.update(unitId, { hp: Math.min(unit.maxhp, unit.hp + hpGain) } as Partial<Unit>);
  }

  gainXp(unitId: UnitID, xp: number): void {
    const unit = this.getUnit(unitId);
    this.unitStore.update(unitId, { xp: unit.xp + xp });
  }
}
