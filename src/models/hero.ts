import { HeroBase, HeroBaseProperties } from '@greegko/rpg-model';
import { UnitProperties } from './unit';
import { Equipment } from './item';

export type HeroProperties = HeroBaseProperties & UnitProperties & {
  equipment: Equipment; 
};

export type Hero = HeroProperties & HeroBase;
