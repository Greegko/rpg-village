import { injectable } from "inversify";

import { commandHandler } from "@core";

import { UnitCommand, UnitCommandEquipItemArgs, UnitCommandUnequipItemArgs } from "./interfaces";
import { UnitService } from "./unit-service";

@injectable()
export class UnitCommandHandler {
  constructor(private unitService: UnitService) {}

  @commandHandler(UnitCommand.EquipItem)
  equipItem({ unitId, itemId }: UnitCommandEquipItemArgs) {
    const item = this.unitService.takeItemFromStash(unitId, itemId);

    if (!item) return;

    this.unitService.equipItem(unitId, item);
  }

  @commandHandler(UnitCommand.UnequipItem)
  unequipEquipment({ unitId, itemId }: UnitCommandUnequipItemArgs) {
    const item = this.unitService.unequipEquipment(unitId, itemId);

    if (!item) return;

    this.unitService.stashItems(unitId, [item]);
  }
}
