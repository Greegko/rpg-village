import { Effect } from "@models/effect";

export type SkillID = string;

export interface Skill {
  id: SkillID;
  effects: Effect[];
}
