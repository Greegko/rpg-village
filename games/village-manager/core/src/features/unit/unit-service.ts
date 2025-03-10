import { add, always, assoc, dissoc, evolve, find, inc, map, propEq, toPairs, when } from "rambda";

import { inject, injectable } from "@rpg-village/core";

import { Item, ItemID } from "@features/item";
import { StashHandler } from "@features/stash";

import { Equipment, EquipmentItem, EquipmentSlot, UnitID } from "./interfaces";
import { getEquipmentSlot, isEquipmentItem } from "./lib";
import { nextLevelXp } from "./lib/next-level-xp";
import { UnitStore } from "./unit-store";

@injectable()
export class UnitService {
  private unitStore = inject(UnitStore);

  getStash(unitId: UnitID) {
    return new StashHandler({
      get: () => this.unitStore.get(unitId).stash,
      update: stashUpdater => this.unitStore.update(unitId, evolve({ stash: stashUpdater })),
    });
  }

  healUnit(unitId: UnitID, hpGain: number): void {
    this.unitStore.update(unitId, unit => ({
      hp: Math.min(unit.maxhp, unit.hp + hpGain),
    }));
  }

  gainXpUnit(unitId: UnitID, xp: number): void {
    const unit = this.unitStore.get(unitId);

    const newXp = unit.xp + xp;

    if (nextLevelXp(unit.level) <= newXp) {
      this.unitStore.update(unitId, evolve({ level: inc, xp: always(0), maxhp: add(20), hp: add(20), dmg: add(5) }));
    } else {
      this.unitStore.update(unitId, evolve({ xp: add(xp) }));
    }
  }

  updateStashItem(unitId: UnitID, itemId: ItemID, item: Item | ((item: Item) => Item)) {
    const itemFn = typeof item === "function" ? item : always(item);

    const evolver = evolve({
      stash: {
        items: map(when(propEq(itemId, "id"), itemFn)),
      },
    });

    this.unitStore.update(unitId, evolver);
  }

  getEquipmentByItemId(unitId: UnitID, itemId: ItemID): [EquipmentSlot, EquipmentItem] | undefined {
    const pairs = toPairs(this.unitStore.get(unitId).equipment) as [EquipmentSlot, EquipmentItem][];

    return find(([slot, item]) => item.id === itemId, pairs);
  }

  getEquipmentBySlot(unitId: UnitID, equipmentSlot: EquipmentSlot): Item | undefined {
    return this.unitStore.get(unitId).equipment[equipmentSlot];
  }

  setEquipment<Slot extends EquipmentSlot>(unitId: UnitID, equipmentSlot: Slot, item: Equipment[Slot] | undefined) {
    if (item === undefined) {
      this.unitStore.update(unitId, unit => evolve({ equipment: dissoc(equipmentSlot) }, unit));
    } else {
      this.unitStore.update(unitId, unit => evolve({ equipment: assoc(equipmentSlot, item) }, unit));
    }
  }

  stashItems(unitId: UnitID, items: Item[]) {
    this.getStash(unitId).addItems(items);
  }

  takeItemFromStash(unitId: UnitID, itemId: ItemID): Item {
    return this.getStash(unitId).takeItem(itemId);
  }

  equipItem(unitId: UnitID, item: Item): void {
    if (!isEquipmentItem(item)) return;

    const slot = getEquipmentSlot(item);

    if (!slot) return;

    const oldItem = this.getEquipmentBySlot(unitId, slot);

    if (oldItem) {
      this.unequipEquipment(unitId, oldItem.id);
      this.stashItems(unitId, [oldItem]);
    }

    this.setEquipment(unitId, slot, item);
  }

  unequipEquipment(unitId: UnitID, itemId: ItemID): EquipmentItem | undefined {
    const equipment = this.getEquipmentByItemId(unitId, itemId);

    if (!equipment) return;

    this.setEquipment(unitId, equipment[0], undefined);

    return equipment[1];
  }
}
