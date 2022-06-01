import { injectable } from "inversify";
import { always, assoc, evolve, map, propEq, when } from "ramda";

import { EntityStore } from "@core/store";

import { EquipmentSlot, Item, ItemID } from "@models/item";

import { Unit, UnitID } from "./interfaces";

@injectable()
export class UnitStore extends EntityStore<UnitID, Unit> {
  healUnit(unitId: UnitID, hpGain: number): void {
    this.update(unitId, unit => ({
      hp: Math.min(unit.maxhp, unit.hp + hpGain),
    }));
  }

  gainXpUnit(unitId: UnitID, xp: number): void {
    this.update(unitId, unit => ({ xp: unit.xp + xp }));
  }

  updateStashItem(unitId: UnitID, itemId: ItemID, item: Item) {
    const evolver = evolve({
      stash: {
        items: map(when(propEq("id", itemId), always(item))),
      },
    });

    this.update(unitId, evolver);
  }

  getEquipment(unitId: UnitID, equipmentSlot: EquipmentSlot): Item | undefined {
    return this.get(unitId).equipment[equipmentSlot];
  }

  setEquipment(unitId: UnitID, equipmentSlot: EquipmentSlot, item: Item) {
    this.update(unitId, unit => evolve({ equipment: assoc(equipmentSlot, item) }, unit));
  }
}
