
import { injectable, inject } from 'inversify';
import { CommandSystem } from "../../lib/command-system";
import { UnitEquipItemCommandArgs, UnitUnequipItemCommandArgs, UnitCommand } from './interfaces/unit-command';
import { UnitStore } from './unit-store';
import { assoc, evolve, path, dissoc } from 'ramda';
import { getItem, removeItem, ItemStash, addItem } from '../../models/stash';
import { Item } from '../../models';

@injectable()
export class UnitCommandHandler {
  constructor(
    @inject('UnitStore') private unitStore: UnitStore
  ) { }

  init(commandSystem: CommandSystem) {
    commandSystem.on(
      UnitCommand.EquipItem,
      (equipItemArgs: UnitEquipItemCommandArgs) => this.equipItem(equipItemArgs)
    );

    commandSystem.on(
      UnitCommand.UnequipItem,
      (unequipItemArgs: UnitUnequipItemCommandArgs) => this.unequipEquipment(unequipItemArgs)
    );
  }

  private equipItem({ unitId, itemId, place }: UnitEquipItemCommandArgs) {
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

  private unequipEquipment({ unitId, place }: UnitUnequipItemCommandArgs) {
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
