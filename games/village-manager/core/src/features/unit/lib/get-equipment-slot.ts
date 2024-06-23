import { Item, ItemType } from "@features/item";

import { EquipmentSlot } from "../interfaces";

export function getEquipmentSlot(item: Item): EquipmentSlot | null {
  switch (item.itemType) {
    case ItemType.Armor:
      return EquipmentSlot.Torso;
    case ItemType.Shield:
      return EquipmentSlot.RightHand;
    case ItemType.Weapon:
      return EquipmentSlot.LeftHand;
    case ItemType.Rune:
      return EquipmentSlot.Rune;
    default:
      return null;
  }
}
