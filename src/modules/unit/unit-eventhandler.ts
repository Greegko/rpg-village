
import { injectable, inject } from 'inversify';
import { EventSystem } from "../../lib/event-system";
import { UnitEquipItemEventArgs, UnitUnequipItemEventArgs, UnitEvents } from './interfaces/unit-events';
import { UnitStore } from './unit-store';
import { assoc, evolve, path, dissoc } from 'ramda';
import { getItem, removeItem, ItemStash, addItem } from '../../models/stash';
import { Item } from '../../models';

@injectable()
export class UnitEventHandler {
  constructor(
    @inject('UnitStore') private unitStore: UnitStore
  ) { }

  init(eventSystem: EventSystem) {
    eventSystem.on(
      UnitEvents.EquipItem,
      (equipItemArgs: UnitEquipItemEventArgs) => this.equipItem(equipItemArgs)
    );

    eventSystem.on(
      UnitEvents.UnequipItem,
      (unequipItemArgs: UnitUnequipItemEventArgs) => this.unequipEquipment(unequipItemArgs)
    );
  }

  private equipItem({ unitId, itemId, place }: UnitEquipItemEventArgs) {
    const unit = this.unitStore.get(unitId);
    const item = getItem(unit.stash, itemId);

    if (!item) return;

    this.unequipEquipment({ unitId, place });

    const evolveUnit = evolve({
      stash: (stash: ItemStash) => removeItem(stash, itemId),
      equipment: assoc(place, item)
    });

    this.unitStore.update(unitId, evolveUnit);
  }

  private unequipEquipment({ unitId, place }: UnitUnequipItemEventArgs) {
    const unit = this.unitStore.get(unitId);
    const item = path(['equipment', place], unit) as Item;

    if (!item) return;

    const newUnit = evolve({
      stash: (stash: ItemStash) => addItem(stash, item),
      equipment: dissoc(place)
    })(unit);

    this.unitStore.update(unitId, newUnit);
  }
}
