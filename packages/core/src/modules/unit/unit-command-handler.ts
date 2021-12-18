import { assoc, evolve, path, dissoc } from "ramda";
import { injectable } from "inversify";
import { commandHandler } from "@core/command";
import { getItem, removeItem, ItemStash, addItem } from "@models/stash";
import { Item } from "@models/item";
import { UnitCommandEquipItemArgs, UnitCommandUnequipItemArgs, UnitCommand } from "./interfaces";
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
