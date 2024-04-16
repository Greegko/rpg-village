import { flatten, map, path } from "rambda";

import { AttackEffectType, EffectDynamic, EffectStatic, EffectType, RuneAttackEffectType } from "@features/effect";
import { Item, ItemType, Rune } from "@features/item";

import { Unit } from "../interfaces";

export function getUnitEffects(unit: Unit): EffectStatic[] {
  const items = [
    path(["equipment", "rightHand"], unit),
    path(["equipment", "leftHand"], unit),
    path(["equipment", "torso"], unit),
    path(["equipment", "rune"], unit),
  ].filter(x => x) as Item[];

  return [...flatten(map(getItemEffects, items)), ...unit.effects];
}

export function getItemEffects(item: Item): EffectStatic[] {
  if (item.itemType === ItemType.Rune) return transformRuneEffectDynamics(item);

  return item.effects as EffectStatic[];
}

function transformRuneEffectDynamics(item: Rune | null): EffectStatic[] {
  if (item === null) return [];

  const effects = item.effects as EffectDynamic[];

  return map(effect => transformRuneEffectDynamic(item, effect), effects);
}

function transformRuneEffectDynamic(item: Rune, effect: EffectDynamic): EffectStatic {
  switch (effect.effectType) {
    case RuneAttackEffectType.Dmg:
      return { type: EffectType.Static, effectType: AttackEffectType.Dmg, value: item.power + item.soul * 10 };
  }
}
