import { ItemID, Event } from '@greegko/rpg-model';

export enum VillageEvents {
  BuildHouse = 'village.buildHouse',
  GenerateGold = 'village.generateGold',
  HireHero = 'village.hireHero',
  SellItem = 'village.sellItem'
};

export interface GenerateGoldEvent extends Event { event: 'village.generateGold' };
export interface BuildHouseEvent extends Event { event: 'village.buildHouse' };
export interface HireHeroEvent extends Event { event: 'village.hireHero' };
export interface SellItemEventArgs { item: ItemID }
export interface SellItemEvent extends Event { event: 'village.sellItem', args: SellItemEventArgs };
