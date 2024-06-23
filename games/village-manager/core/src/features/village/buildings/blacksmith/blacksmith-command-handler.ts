import { injectable } from "inversify";
import { append, evolve } from "rambda";

import { commandHandler } from "@rpg-village/core";

import { AttackEffectType, Effect, EffectType } from "@features/effect";
import { Item, ItemID, ItemType, armorFactory, shieldFactory, weaponFactory } from "@features/item";
import { PartyService } from "@features/party";
import { EquipmentItem, UnitID, UnitService } from "@features/unit";

import { VillageService } from "../../village-service";
import {
  BlacksmithCommand,
  BlacksmithCommandCreateItemArgs,
  BlacksmithCommandUpgradeItemArgs,
} from "./blacksmith-command";

@injectable()
export class BlacksmithCommandHandler {
  constructor(
    private unitService: UnitService,
    private partyService: PartyService,
    private villageService: VillageService,
  ) {}

  @commandHandler(BlacksmithCommand.UpgradeItem)
  upgradeItem(args: BlacksmithCommandUpgradeItemArgs) {
    this.upgradeUnitStashItem(args.unitId, args.itemId);
    this.upgradeEquipmentItem(args.unitId, args.itemId);
  }

  @commandHandler(BlacksmithCommand.CreateItem)
  createItem(args: BlacksmithCommandCreateItemArgs) {
    const price = 50;
    const stash = this.villageService.getStash(args.villageId);
    if (stash.hasEnoughResource({ gold: price })) {
      stash.removeResource({ gold: price });

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

      stash.addItems([item]);
    }
  }

  private upgradeUnitStashItem(unitId: UnitID, itemId: ItemID) {
    this.unitService.updateStashItem(unitId, itemId, (item: Item) =>
      this.adjustEquipmentWithEffect(unitId, item as EquipmentItem),
    );
  }

  private upgradeEquipmentItem(unitId: UnitID, itemId: ItemID) {
    const equipment = this.unitService.getEquipmentByItemId(unitId, itemId);

    if (equipment) {
      this.unitService.setEquipment(unitId, equipment[0], this.adjustEquipmentWithEffect(unitId, equipment[1]));
    }
  }

  private adjustEquipmentWithEffect(unitId: UnitID, item: EquipmentItem): EquipmentItem {
    const price = ((item.effects || []).length + 1) * 50;

    const party = this.partyService.getPartyForUnitId(unitId);

    if (!party) throw new Error("Not handled error case!");

    const stash = this.partyService.getStash(party.id);

    if (stash.hasEnoughResource({ gold: price })) {
      stash.removeResource({ gold: price });

      return evolve({ effects: append(this.createDmgEffect()) }, item);
    }

    return item;
  }

  private createDmgEffect(): Effect {
    return {
      type: EffectType.Static,
      effectType: AttackEffectType.Dmg,
      value: 2,
    };
  }
}
