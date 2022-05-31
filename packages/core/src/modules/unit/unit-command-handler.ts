import { Item } from "@models/item";
import { ItemStash, addItem, getItem, removeItem } from "@models/stash";
import { injectable } from "inversify";
import { assoc, dissoc, evolve, path } from "ramda";

import { commandHandler } from "@core/command";

import { UnitCommand, UnitCommandEquipItemArgs, UnitCommandUnequipItemArgs } from "./interfaces";
import { UnitStore } from "./unit-store";

@injectable()
export class UnitCommandHandler {
  constructor(private unitStore: UnitStore) {}

  @commandHandler(UnitCommand.EquipItem)
  equipItem({ unitId, itemId, slot }: UnitCommandEquipItemArgs) {
    const unit = this.unitStore.get(unitId);
    const item = getItem(unit.stash, itemId);

    if (!item) return;

    this.unequipEquipment({ unitId, slot });

    const evolveUnit = evolve({
      stash: (stash: ItemStash) => removeItem(stash, itemId),
      equipment: assoc(slot, item) as any,
    });

    this.unitStore.update(unitId, evolveUnit);
  }

  @commandHandler(UnitCommand.UnequipItem)
  unequipEquipment({ unitId, slot }: UnitCommandUnequipItemArgs) {
    const unit = this.unitStore.get(unitId);
    const item = path(["equipment", slot], unit) as Item;

    if (!item) return;

    const evolveUnit = evolve({
      stash: (stash: ItemStash) => addItem(stash, item),
      equipment: dissoc(slot),
    });

    this.unitStore.update(unitId, evolveUnit);
  }
}
