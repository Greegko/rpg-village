import { Effect } from '../../../models';

export type SkillID = string;

export interface Skill {
  id: SkillID;
  effects: Effect[];
}
