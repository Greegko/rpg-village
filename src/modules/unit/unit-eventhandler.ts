
import { injectable, inject } from 'inversify';
import { EventSystem } from "../../lib/event-system";
import { UnitEquipItemEventArgs, UnitUnequipItemEventArgs, UnitEvents } from './unit-events';
import { StashItems } from '../stash';
import { UnitEquipmentService } from './unit-equipment-service';

@injectable()
export class UnitEventHandler {
  constructor(
    @inject('UnitEquipmentService') private unitEquipmentService: UnitEquipmentService,
    @inject('StashItems') private stashItems: StashItems,
  ) { }

  init(eventSystem: EventSystem) {
    eventSystem.on(
      UnitEvents.EquipItem,
      (equipItemArgs: UnitEquipItemEventArgs) => this._equipItem(equipItemArgs)
    );

    eventSystem.on(
      UnitEvents.UnequipItem,
      (unequipItemArgs: UnitUnequipItemEventArgs) => this._unequipEquipment(unequipItemArgs)
    );
  }

  private _equipItem({ unitId: unitId, itemId, stashId, place }: UnitEquipItemEventArgs) {
    const item = this.stashItems.takeItem(stashId, itemId);
    this.unitEquipmentService.equipItem(unitId, item, place);
  }

  private _unequipEquipment({ unitId: unitId, stashId, place }: UnitUnequipItemEventArgs) {
    const item = this.unitEquipmentService.unEquipItem(unitId, place);
    this.stashItems.addItems(stashId, [item]);
  }
}
