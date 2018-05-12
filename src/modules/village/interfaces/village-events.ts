import { Event } from '@greegko/rpg-model';

export enum VillageEvents {
  BuildHouse = 'village.buildHouse',
  GenerateGold = 'village.generateGold',
  HireHero = 'village.hireHero'
};

export interface GenerateGoldEvent extends Event { event: 'village.generateGold' };
export interface BuildHouseEvent extends Event { event: 'village.buildHouse' };
export interface HireHeroEvent extends Event { event: 'village.hireHero' };
