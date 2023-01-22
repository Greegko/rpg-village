import { AttackEffectType, DefenseEffectType, Item, ItemType, getItemEffects } from "@rpg-village/core";

import { translate } from "../../game";

export const ItemStats = ({ item }: { item: Item }) => (
  <div>
    <div>Name: {item.name}</div>
    <div>Stats</div>
    {getItemEffects(item).map((effect, i) => (
      <div key={i}>
        <span>
          {AttackEffectType[effect.type] &&
            translate("core.model.attackEffectType")[effect.effectType as AttackEffectType]}
          {DefenseEffectType[effect.type] &&
            translate("core.model.defenseEffectType")[effect.effectType as DefenseEffectType]}
        </span>
        <span>{effect.value}</span>
      </div>
    ))}

    <RuneStats item={item} />
  </div>
);

const RuneStats = ({ item }: { item: Item }) => {
  if (item.itemType !== ItemType.Rune) return null;

  return (
    <>
      <div>Power: {item.power}</div>
      <div>Soul: {item.soul}</div>
    </>
  );
};
