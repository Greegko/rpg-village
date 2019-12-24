import { UnitBase } from '../../core-src';
import { SkillID } from '../modules';

export type Unit = {
  skillIds: SkillID[];
  dmg: number;
  armor: number;
} & UnitBase;
