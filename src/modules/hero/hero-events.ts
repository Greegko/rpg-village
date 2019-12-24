import { UnitID, Event, StashID } from "../../../core-src";
import { EquipmentPlace, ItemID } from '../../models';

export enum HeroEvents {
  EquipItem = 'hero/equip-item',
  UnequipItem = 'hero/unequip-item'
};

export interface HeroEquipItemArgs {
  heroId: UnitID;
  itemId: ItemID;
  stashId: StashID;
  place: EquipmentPlace;
}

export interface HeroEquipItemEvent extends Event {
  event: HeroEvents.EquipItem,
  args: { heroId: UnitID, itemId: ItemID, stashId: StashID, place: EquipmentPlace }
};

export interface HeroUnequipItemArgs {
  heroId: UnitID;
  stashId: StashID;
  place: EquipmentPlace;
}

export interface HeroUnequipItemEvent extends Event {
  event: HeroEvents.UnequipItem,
  args: { heroId: UnitID, stashId: StashID, place: EquipmentPlace }
};