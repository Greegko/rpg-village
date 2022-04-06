import { injectable } from "inversify";
import { append, evolve } from "ramda";

import { commandHandler } from "@core/command";
import { AttackEffectType, Effect } from "@models/effect";
import { EquipmentSlot, Item, ItemID, ItemType } from "@models/item";
import { UnitID, UnitStore } from "@modules/unit";
import { getItem } from "@models/stash";
import { VillageStashService } from "@modules/village";

import { armorFactory, shieldFactory, weaponFactory } from "@modules/village/lib/equipment-factory";

import {
  BlacksmithCommandCreateItemArgs,
  BlacksmithCommand,
  BlacksmithCommandUpgradeItemArgs,
} from "./blacksmith-command";

@injectable()
export class BlacksmithCommandHandler {
  constructor(private unitStore: UnitStore, private villageStashService: VillageStashService) {}

  @commandHandler(BlacksmithCommand.UpgradeItem)
  upgradeItem(args: BlacksmithCommandUpgradeItemArgs) {
    if (args.equipmentSlot) {
      this.upgradeEquipmentItem(args.unitId, args.equipmentSlot);
    } else if (args.itemId) {
      this.upgradeStashItem(args.unitId, args.itemId);
    }
  }

  @commandHandler(BlacksmithCommand.CreateItem)
  createItem(args: BlacksmithCommandCreateItemArgs) {
    const price = 50;
    if (this.villageStashService.hasEnoughResource({ gold: price })) {
      this.villageStashService.removeResource({ gold: price });

      const item = (() => {
        switch (args.itemType) {
          case ItemType.Armor:
            return armorFactory();
          case ItemType.Shield:
            return shieldFactory();
          case ItemType.Weapon:
            return weaponFactory();
        }
      })();

      this.villageStashService.addItems([item]);
    }
  }

  private upgradeStashItem(unitId: UnitID, itemId: ItemID) {
    const unit = this.unitStore.get(unitId);

    const stashItem = getItem(unit.stash, itemId);
    if (stashItem) {
      const newItem = this.adjustItemWithEffect(stashItem);
      this.unitStore.updateStashItem(unitId, itemId, newItem);
    }
  }

  private upgradeEquipmentItem(unitId: UnitID, equipmentSlot: EquipmentSlot) {
    const item = this.unitStore.getEquipment(unitId, equipmentSlot);

    if (item) {
      const newItem = this.adjustItemWithEffect(item);
      this.unitStore.setEquipment(unitId, equipmentSlot, newItem);
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
