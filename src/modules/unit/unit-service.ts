import { inject, injectable } from 'inversify';
import { UnitStore } from './unit-store';
import { UnitID, Unit } from './interfaces';

@injectable()
export class UnitService {
  constructor(@inject('UnitStore') private unitStore: UnitStore) { }

  addUnit(unit: Omit<Unit, 'id'>): UnitID {
    const newUnit = this.unitStore.add(unit);
    return newUnit.id;
  }

  getUnit(unitId: UnitID): Unit {
    return this.unitStore.get(unitId);
  }

  healUnit(unitId: UnitID, hpGain: number): void {
    const unit = this.unitStore.get(unitId);
    this.unitStore.update(unitId, { hp: Math.min(unit.maxhp, unit.hp + hpGain) } as Partial<Unit>);
  }

  gainXpUnit(unitId: UnitID, xp: number): void {
    const unit = this.getUnit(unitId);
    this.unitStore.update(unitId, { xp: unit.xp + xp });
  }
}
