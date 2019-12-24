import { HeroBase } from '../../core-src';
import { HeroEquipment } from './item';
import { Unit } from './unit';

export type Hero = { equipment: HeroEquipment } & Unit & HeroBase;
