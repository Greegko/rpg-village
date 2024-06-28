import { For, Show } from "solid-js";

import {
  AttackEffectType,
  DefenseEffectType,
  Item,
  ItemType,
  Rune,
  getItemEffects,
} from "@rpg-village/village-manager-core";

import { translate } from "../../game";

export const ItemStats = (props: { item: Item }) => (
  <div>
    <div>Name: {props.item.name}</div>
    <div>Stats</div>
    <For each={getItemEffects(props.item)}>
      {effect => (
        <div>
          <span>
            <Show when={AttackEffectType[effect.type]}>
              {translate("core.model.attackEffectType")[effect.effectType as AttackEffectType]}
            </Show>
            <Show when={DefenseEffectType[effect.type]}>
              {translate("core.model.defenseEffectType")[effect.effectType as DefenseEffectType]}
            </Show>
          </span>
          <span>{effect.value}</span>
        </div>
      )}
    </For>

    <RuneStats item={props.item} />
  </div>
);

const RuneStats = (props: { item: Item }) => (
  <Show when={props.item.itemType === ItemType.Rune}>
    <div>Power: {(props.item as Rune).power}</div>
    <div>Soul: {(props.item as Rune).soul}</div>
  </Show>
);
