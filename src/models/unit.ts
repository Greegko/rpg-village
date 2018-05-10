import { UnitBase, UnitBaseProperties } from '@greegko/rpg-model';
import { SkillID } from '../modules';

export type UnitProperties = UnitBaseProperties & {
  skillIds: SkillID[];
  dmg: number;
  armor: number;
};

export type Unit = UnitProperties & UnitBase;
