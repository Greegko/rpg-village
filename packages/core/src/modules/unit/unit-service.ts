import { propEq, evolve, map, when, always, assoc } from "ramda";
import { injectable } from "inversify";
import { ItemID, Item, EquipmentSlot } from "@models/item";
import { UnitStore } from "./unit-store";
import { UnitID, Unit } from "./interfaces";

@injectable()
export class UnitService {
  constructor(private unitStore: UnitStore) {}

  addUnit(unit: Omit<Unit, "id">): UnitID {
    const newUnit = this.unitStore.add(unit);
    return newUnit.id;
  }

  getUnit(unitId: UnitID): Unit {
    return this.unitStore.get(unitId);
  }

  healUnit(unitId: UnitID, hpGain: number): void {
    this.unitStore.update(unitId, unit => ({
      hp: Math.min(unit.maxhp, unit.hp + hpGain),
    }));
  }

  gainXpUnit(unitId: UnitID, xp: number): void {
    this.unitStore.update(unitId, unit => ({ xp: unit.xp + xp }));
  }

  updateStashItem(unitId: UnitID, itemId: ItemID, item: Item) {
    const evolver = evolve({
      stash: {
        items: map(when(propEq("id", itemId), always(item))),
      },
    });

    this.unitStore.update(unitId, evolver);
  }

  getEquipment(unitId: UnitID, equipmentSlot: EquipmentSlot): Item | undefined {
    return this.unitStore.get(unitId).equipment[equipmentSlot];
  }

  setEquipment(unitId: UnitID, equipmentSlot: EquipmentSlot, item: Item) {
    this.unitStore.update(unitId, unit => evolve({ equipment: assoc(equipmentSlot, item) }, unit));
  }

  removeUnit(unitId: UnitID) {
    this.unitStore.remove(unitId);
  }
}
