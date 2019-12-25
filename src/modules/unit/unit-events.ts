import { StashID } from "../stash";
import { UnitID } from ".";
import { EquipmentPlace, ItemID, Event } from '../../models';

export enum UnitEvents {
  EquipItem = 'unit/equip-item',
  UnequipItem = 'unit/unequip-item'
};

export interface UnitEquipItemEventArgs {
  unitId: UnitID;
  itemId: ItemID;
  stashId: StashID;
  place: EquipmentPlace;
}

export interface UnitEquipItemEvent extends Event {
  event: UnitEvents.EquipItem,
  args: { unitId: UnitID, itemId: ItemID, stashId: StashID, place: EquipmentPlace }
};

export interface UnitUnequipItemEventArgs {
  unitId: UnitID;
  stashId: StashID;
  place: EquipmentPlace;
}

export interface UnitUnequipItemEvent extends Event {
  event: UnitEvents.UnequipItem,
  args: { unitId: UnitID, stashId: StashID, place: EquipmentPlace }
};