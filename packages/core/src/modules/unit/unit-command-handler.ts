import { assoc, evolve, path, dissoc } from "ramda";
import { injectable, inject } from "inversify";
import { CommandSystem } from "@core/command";
import { getItem, removeItem, ItemStash, addItem } from "@models/stash";
import { Item } from "@models/item";
import { UnitEquipItemCommandArgs, UnitUnequipItemCommandArgs, UnitCommand } from "./interfaces";
import { UnitStore } from "./unit-store";

@injectable()
export class UnitCommandHandler {
  constructor(@inject("UnitStore") private unitStore: UnitStore) {}

  init(commandSystem: CommandSystem) {
    commandSystem.on(UnitCommand.EquipItem, (equipItemArgs: UnitEquipItemCommandArgs) => this.equipItem(equipItemArgs));

    commandSystem.on(UnitCommand.UnequipItem, (unequipItemArgs: UnitUnequipItemCommandArgs) =>
      this.unequipEquipment(unequipItemArgs),
    );
  }

  private equipItem({ unitId, itemId, slot }: UnitEquipItemCommandArgs) {
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

  private unequipEquipment({ unitId, slot }: UnitUnequipItemCommandArgs) {
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
