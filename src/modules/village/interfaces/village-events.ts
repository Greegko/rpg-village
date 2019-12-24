import { Event } from "../../../../core-src";

export enum VillageEvents {
  BuildHouse = 'village/build-house',
  GenerateGold = 'village/generate-gold',
  HireHero = 'village/hire-hero'
};

export interface GenerateGoldEvent extends Event { event: VillageEvents.GenerateGold };
export interface BuildHouseEvent extends Event { event: VillageEvents.BuildHouse };
export interface HireHeroEvent extends Event { event: VillageEvents.HireHero };
