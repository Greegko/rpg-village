import { HeroBase, HeroBaseProperties } from '@greegko/rpg-model';
import { UnitProperties } from './unit';

export type HeroProperties = HeroBaseProperties & UnitProperties;

export type Hero = HeroProperties & HeroBase;
