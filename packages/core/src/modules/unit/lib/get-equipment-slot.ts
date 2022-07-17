import { EquipmentSlot, Item, ItemType } from "@models/item";

export function getEquipmentSlot(item: Item): EquipmentSlot | null {
  switch (item.itemType) {
    case ItemType.Armor:
      return EquipmentSlot.Torso;
    case ItemType.Shield:
      return EquipmentSlot.RightHand;
    case ItemType.Weapon:
      return EquipmentSlot.LeftHand;
    default:
      return null;
  }
}
