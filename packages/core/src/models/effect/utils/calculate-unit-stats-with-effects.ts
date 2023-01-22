import { clone, propOr, reduce, sortBy } from "ramda";

import { Unit, getUnitEffects } from "@modules/unit";

import { EffectStatic } from "../effect";
import { unitEffectBasePropertiesMap } from "../unit-effect-property-map";

export function calculateUnitStatsWithEffects(unit: Unit): Unit {
  const unitWithEffects: Unit = clone(unit);

  const effectsToApply = sortBy(propOr(false, "isPercentage"), getUnitEffects(unit));

  return reduce(applyEffect, unitWithEffects, effectsToApply);
}

function getEffectBaseProperty(effect: EffectStatic): keyof Unit {
  return unitEffectBasePropertiesMap[effect.effectType];
}

function applyEffect(unit: Unit, effect: EffectStatic): Unit {
  let prop = getEffectBaseProperty(effect);

  if (!prop) return unit;

  if (effect.isPercentage) {
    (unit[prop] as number) *= effect.value / 100 + 1;
  } else {
    (unit[prop] as number) += effect.value;
  }

  return unit;
}