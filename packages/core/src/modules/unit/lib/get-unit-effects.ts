import { flatten, map, path } from "ramda";

import { AttackEffectType, EffectBase, EffectDynamic, RuneAttackEffectType } from "@models/effect";
import { Item, ItemType, Rune } from "@models/item";

import { Unit } from "../interfaces";

export function getUnitEffects(unit: Unit): EffectBase[] {
  const items = [
    path(["equipment", "rightHand"], unit),
    path(["equipment", "leftHand"], unit),
    path(["equipment", "torso"], unit),
    path(["equipment", "rune"], unit),
  ].filter(x => x) as Item[];

  return flatten(map(getItemEffects, items));
}

export function getItemEffects(item: Item): EffectBase[] {
  if(item.itemType === ItemType.Rune) return transformRuneEffectDynamics(item);

  return item.effects as EffectBase[];
}


function transformRuneEffectDynamics(item: Rune | null): EffectBase[] {
  if(item === null) return [];

  const effects = item.effects as EffectDynamic[];

  return map(effect => transformRuneEffectDynamic(item, effect), effects);
}

function transformRuneEffectDynamic(item: Rune, effect: EffectDynamic): EffectBase {
  switch(effect.type) {
    case RuneAttackEffectType.Dmg:
      return { type: AttackEffectType.Dmg, value: item.power + item.soul * 10 };
  }
}
