import { AttackEffectType, DefenseEffectType, Item, ItemType } from "@rpg-village/core";

import { translate } from "../../game";

export const ItemStats = ({ item }: { item: Item }) => (
  <div>
    <div>Name: {item.name}</div>
    <div>Stats</div>
    {item.effects.map((effect, i) => (
      <div key={i}>
        <span>
          {AttackEffectType[effect.type] && translate("core.model.attackEffectType")[effect.type as AttackEffectType]}
          {DefenseEffectType[effect.type] &&
            translate("core.model.defenseEffectType")[effect.type as DefenseEffectType]}
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
