import { injectable } from "inversify";

import { commandHandler } from "@core/command";

import { isEquipmentItem } from "@models/item";
import { VillageStashService } from "@modules/village";

import { StashLocation, UnitCommand, UnitCommandEquipItemArgs, UnitCommandUnequipItemArgs } from "./interfaces";
import { getEquipmentSlot } from "./lib";
import { UnitService } from "./unit-service";

@injectable()
export class UnitCommandHandler {
  constructor(private unitService: UnitService, private villageStash: VillageStashService) {}

  @commandHandler(UnitCommand.EquipItem)
  equipItem({ unitId, itemId, stash }: UnitCommandEquipItemArgs) {
    const item =
      stash === StashLocation.Unit
        ? this.unitService.takeItemFromStash(unitId, itemId)
        : this.villageStash.takeItem(itemId);

    if (!item) return;

    if (!isEquipmentItem(item)) return;

    const slot = getEquipmentSlot(item);

    if (!slot) return;

    const oldItem = this.unitService.getEquipmentBySlot(unitId, slot);
    if (oldItem) {
      this.unequipEquipment({ unitId, itemId: oldItem.id, stash });
    }

    this.unitService.setEquipment(unitId, slot, item);
  }

  @commandHandler(UnitCommand.UnequipItem)
  unequipEquipment({ unitId, itemId, stash }: UnitCommandUnequipItemArgs) {
    const equipment = this.unitService.getEquipmentByItemId(unitId, itemId);

    if (!equipment) return;

    this.unitService.setEquipment(unitId, equipment[0], undefined);

    if (stash === StashLocation.Unit) {
      this.unitService.stashItems(unitId, [equipment[1]]);
    }

    if (stash === StashLocation.Village) {
      this.villageStash.addItems([equipment[1]]);
    }
  }
}
