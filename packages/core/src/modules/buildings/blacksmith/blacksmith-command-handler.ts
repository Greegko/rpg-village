import { injectable } from "inversify";
import { append, evolve } from "ramda";

import { CommandSystem } from "@core/command";
import { AttackEffectType, Effect } from "@models/effect";
import { EquipmentSlot, Item, ItemID } from "@models/item";
import { UnitID, UnitService } from "@modules/unit";
import { getItem } from "@models/stash";
import { VillageStashService } from "@modules/village";
import { BlacksmithCommand, UpgradeItemCommandArgs } from "./blacksmith-command";

@injectable()
export class BlacksmithCommandHandler {
  constructor(
    private unitService: UnitService,
    private villageStashService: VillageStashService,
  ) {}

  init(commandSystem: CommandSystem) {
    commandSystem.on(BlacksmithCommand.UpgradeItem, (args: UpgradeItemCommandArgs) => {
      if (args.equipmentSlot) {
        this.upgradeEquipmentItem(args.unitId, args.equipmentSlot);
      } else if (args.itemId) {
        this.upgradeStashItem(args.unitId, args.itemId);
      }
    });
  }

  upgradeStashItem(unitId: UnitID, itemId: ItemID) {
    const unit = this.unitService.getUnit(unitId);

    const stashItem = getItem(unit.stash, itemId);
    if (stashItem) {
      const newItem = this.adjustItemWithEffect(stashItem);
      this.unitService.updateStashItem(unitId, itemId, newItem);
    }
  }

  upgradeEquipmentItem(unitId: UnitID, equipmentSlot: EquipmentSlot) {
    const item = this.unitService.getEquipment(unitId, equipmentSlot);

    if (item) {
      const newItem = this.adjustItemWithEffect(item);
      this.unitService.setEquipment(unitId, equipmentSlot, newItem);
    }
  }

  private adjustItemWithEffect(item: Item): Item {
    const price = ((item.effects || []).length + 1) * 50;
    if (this.villageStashService.hasEnoughResource({ gold: price })) {
      this.villageStashService.removeResource({ gold: price });
      return evolve({ effects: append(this.createDmgEffect()) }, item);
    }

    return item;
  }

  private createDmgEffect(): Effect {
    return {
      value: 2,
      type: AttackEffectType.Dmg,
    };
  }
}
