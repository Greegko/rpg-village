import { UnitBase } from '@greegko/rpg-model';
import { SkillID } from '../modules';

export type Unit = {
  skillIds: SkillID[];
  dmg: number;
  armor: number;
} & UnitBase;
