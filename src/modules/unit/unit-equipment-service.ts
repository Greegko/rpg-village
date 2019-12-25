import { injectable, inject } from 'inversify';
import { assocPath, dissocPath, path } from 'ramda';
import { UnitID, UnitStore } from ".";
import { Item, EquipmentPlace } from '../../models';

@injectable()
export class UnitEquipmentService {
  constructor(
    @inject('UnitStore') private unitStore: UnitStore
  ) { }

  equipItem(unitId: UnitID, item: Item, place: EquipmentPlace) {
    const unit = this.unitStore.get(unitId);
    const newUnit = assocPath(['equipment', place], item, unit);

    this.unitStore.update(unitId, newUnit);
  }

  unEquipItem(unitId: UnitID, place: EquipmentPlace): Item {
    const unit = this.unitStore.get(unitId);
    const item = path(['equipment', place], unit) as Item;
    const newUnit = dissocPath(['equipment', place], unit);

    this.unitStore.update(unitId, newUnit);
    return item;
  }
}
