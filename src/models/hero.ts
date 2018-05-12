import { HeroBase, HeroBaseProperties } from '@greegko/rpg-model';
import { UnitProperties } from './unit';
import { HeroEquipment } from './item';

export type HeroProperties = HeroBaseProperties & UnitProperties & {
  equipment: HeroEquipment; 
};

export type Hero = HeroProperties & HeroBase;
