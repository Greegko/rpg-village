import { injectable } from "inversify";
import { append, evolve } from "ramda";

import { commandHandler } from "@core/command";

import { AttackEffectType, Effect } from "@models/effect";
import { Item, ItemID, ItemType } from "@models/item";
import { StashLocation, UnitID, UnitService } from "@modules/unit";
import { VillageStashService } from "@modules/village";
import { armorFactory, shieldFactory, weaponFactory } from "@modules/village/lib/equipment-factory";

import {
  BlacksmithCommand,
  BlacksmithCommandCreateItemArgs,
  BlacksmithCommandUpgradeItemArgs,
} from "./blacksmith-command";

@injectable()
export class BlacksmithCommandHandler {
  constructor(private unitService: UnitService, private villageStashService: VillageStashService) {}

  @commandHandler(BlacksmithCommand.UpgradeItem)
  upgradeItem(args: BlacksmithCommandUpgradeItemArgs) {
    if ("stash" in args) {
      if (args.stash === StashLocation.Unit && "unitId" in args) {
        this.upgradeUnitStashItem(args.unitId!, args.itemId);
      }

      if (args.stash === StashLocation.Village) {
        this.upgradeVillageStashItem(args.itemId);
      }
    } else if ("unitId" in args) {
      this.upgradeEquipmentItem(args.unitId!, args.itemId);
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
      })()!;

      this.villageStashService.addItems([item]);
    }
  }

  private upgradeUnitStashItem(unitId: UnitID, itemId: ItemID) {
    this.unitService.updateStashItem(unitId, itemId, item => this.adjustItemWithEffect(item));
  }

  private upgradeVillageStashItem(itemId: ItemID) {
    this.villageStashService.updateStashItem(itemId, item => this.adjustItemWithEffect(item));
  }

  private upgradeEquipmentItem(unitId: UnitID, itemId: ItemID) {
    const equipment = this.unitService.getEquipmentByItemId(unitId, itemId);

    if (equipment) {
      this.unitService.setEquipment(unitId, equipment[0], this.adjustItemWithEffect(equipment[1]));
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
