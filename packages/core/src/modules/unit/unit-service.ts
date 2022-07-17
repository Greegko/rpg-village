import { injectable } from "inversify";
import { always, assoc, dissoc, evolve, map, propEq, when } from "ramda";

import { EquipmentSlot, Item, ItemID } from "@models/item";
import { ItemStash, addItems, getItem, removeItem } from "@models/stash";

import { UnitID } from "./interfaces";
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

  getEquipment(unitId: UnitID, equipmentSlot: EquipmentSlot): Item | undefined {
    return this.unitStore.get(unitId).equipment[equipmentSlot];
  }

  setEquipment(unitId: UnitID, equipmentSlot: EquipmentSlot, item: Item | undefined) {
    if (item === undefined) {
      this.unitStore.update(unitId, unit => evolve({ equipment: dissoc(equipmentSlot) }, unit));
    } else {
      this.unitStore.update(unitId, unit => evolve({ equipment: assoc(equipmentSlot, item) }, unit));
    }
  }

  stashItems(unitId: UnitID, items: Item[]) {
    const evolveUnit = evolve({
      stash: (stash: ItemStash) => addItems(stash, items),
    });

    this.unitStore.update(unitId, evolveUnit);
  }

  takeItemFromStash(unitId: UnitID, itemId: ItemID): Item {
    const stash = this.unitStore.get(unitId);
    const item = getItem(stash.stash, itemId);

    const evolveUnit = evolve({
      stash: (stash: ItemStash) => removeItem(stash, itemId),
    });

    this.unitStore.update(unitId, evolveUnit);

    return item;
  }
}
