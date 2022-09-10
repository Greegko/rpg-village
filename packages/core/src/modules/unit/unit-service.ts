import { injectable } from "inversify";
import { always, assoc, dissoc, evolve, find, map, propEq, toPairs, when } from "ramda";

import { Equipment, EquipmentItem, EquipmentSlot, Item, ItemID } from "@models/item";
import { addItems, getItem, removeItem } from "@models/stash";

import { UnitID, UnitStash } from "./interfaces";
import { UnitStore } from "./unit-store";

@injectable()
export class UnitService {
  constructor(private unitStore: UnitStore) {}

  healUnit(unitId: UnitID, hpGain: number): void {
    this.unitStore.update(unitId, unit => ({
      hp: Math.min(unit.maxhp, unit.hp + hpGain),
    }));
  }

  gainXpUnit(unitId: UnitID, xp: number): void {
    this.unitStore.update(unitId, unit => ({ xp: unit.xp + xp }));
  }

  updateStashItem(unitId: UnitID, itemId: ItemID, item: Item | ((item: Item) => Item)) {
    const itemFn = typeof item === "function" ? item : always(item);

    const evolver = evolve({
      stash: {
        items: map(when(propEq("id", itemId), itemFn)),
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
    const evolveUnit = evolve({
      stash: (stash: UnitStash) => addItems(stash, items),
    });

    this.unitStore.update(unitId, evolveUnit);
  }

  takeItemFromStash(unitId: UnitID, itemId: ItemID): Item {
    const unit = this.unitStore.get(unitId);
    const item = getItem(unit.stash, itemId);

    const evolveUnit = evolve({
      stash: (stash: UnitStash) => removeItem(stash, itemId),
    });

    this.unitStore.update(unitId, evolveUnit);

    return item;
  }
}
