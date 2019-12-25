import { Event } from "../../../models";

export enum VillageEvents {
  BuildHouse = 'village/build-house',
  GenerateGold = 'village/generate-gold',
  HireHero = 'village/hire-unit'
};

export interface GenerateGoldEvent extends Event { event: VillageEvents.GenerateGold };
export interface BuildHouseEvent extends Event { event: VillageEvents.BuildHouse };
export interface HireUnitEvent extends Event { event: VillageEvents.HireHero };
