import { Effect, SeekCondition } from "@/features/effect";

export interface Spell {
  seekConditions: SeekCondition[];
  effects?: Effect[];
  addEffects?: Effect[];
}

export type SpellID = string;
