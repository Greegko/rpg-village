import { EquipmentSlot, Item, ItemType } from "@models";

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
