import { ItemType } from "@features/item";

import { EquipmentItem } from "../interfaces";

export function isEquipmentItem(val: any): val is EquipmentItem {
  if (
    val.itemType === ItemType.Armor ||
    val.itemType === ItemType.Shield ||
    val.itemType === ItemType.Weapon ||
    val.itemType === ItemType.Rune
  )
    return true;

  return false;
}
