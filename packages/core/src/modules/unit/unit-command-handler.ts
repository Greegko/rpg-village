import { injectable } from "inversify";

import { commandHandler } from "@core/command";

import { VillageStashService } from "@modules/village";

import { StashLocation, UnitCommand, UnitCommandEquipItemArgs, UnitCommandUnequipItemArgs } from "./interfaces";
import { UnitService } from "./unit-service";

@injectable()
export class UnitCommandHandler {
  constructor(private unitService: UnitService, private villageStash: VillageStashService) {}

  @commandHandler(UnitCommand.EquipItem)
  equipItem({ unitId, itemId, slot, stash }: UnitCommandEquipItemArgs) {
    const item =
      stash === StashLocation.Unit
        ? this.unitService.takeItemFromStash(unitId, itemId)
        : this.villageStash.takeItem(itemId);

    if (!item) return;

    this.unequipEquipment({ unitId, slot, stash });

    this.unitService.setEquipment(unitId, slot, item);
  }

  @commandHandler(UnitCommand.UnequipItem)
  unequipEquipment({ unitId, slot, stash }: UnitCommandUnequipItemArgs) {
    const item = this.unitService.getEquipment(unitId, slot);

    this.unitService.setEquipment(unitId, slot, undefined);

    if (!item) return;

    if (stash === StashLocation.Unit) {
      this.unitService.stashItems(unitId, [item]);
    }

    if (stash === StashLocation.Village) {
      this.villageStash.addItems([item]);
    }
  }
}
