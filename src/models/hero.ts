import { HeroBase } from '@greegko/rpg-model';
import { HeroEquipment } from './item';
import { Unit } from './unit';

export type Hero = { equipment: HeroEquipment } & Unit & HeroBase;
