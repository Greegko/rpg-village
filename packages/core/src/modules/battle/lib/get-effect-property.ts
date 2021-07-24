import { Effect, unitEffectPropertyMap } from "@models/effect";
import { BattleStats } from "../interfaces";

export function getEffectProperty(effect: Effect): keyof BattleStats {
  return unitEffectPropertyMap[effect.type] as keyof BattleStats;
}
