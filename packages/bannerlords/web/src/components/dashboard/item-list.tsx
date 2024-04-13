import { range } from "rambda";
import { For, Match, Show, Switch, createComputed, createSignal, on } from "solid-js";

import { Item, ItemType } from "@rpg-village/bannerlords";

import { Asset, Popup } from "../core";
import { ItemStats } from "./item-stats";

import "./item-list.scss";

export interface ItemListProperties {
  items: Item[];
  listSize: number;
  hideEmpty?: boolean;
  smallDisplay?: boolean;
  onItemSelect?: (item: Item | null) => void;
}

export const ItemList = (props: ItemListProperties) => {
  const [selectedItemIndex, setSelectedItemIndex] = createSignal<number | null>();

  createComputed(on(selectedItemIndex, () => setSelectedItemIndex(null)));

  const itemClick = (event: MouseEvent, index: number) => {
    if (!props.onItemSelect) return;

    event.stopPropagation();

    if (index === selectedItemIndex()) return;

    if (props.items[index]) {
      setSelectedItemIndex(index);
      props.onItemSelect!(props.items[index]);
    } else {
      props.onItemSelect!(null);
    }
  };

  const getAssetId = (index: number) => {
    if (!props.items || !props.items[index]) return "placeholder";

    switch (props.items[index].itemType) {
      case ItemType.Armor:
        return "helmet_1";
      case ItemType.Weapon:
        return "weapon_1";
      case ItemType.Shield:
        return "shield_1";
      case ItemType.DungeonKey:
        return "dungeon_key";
      case ItemType.Rune:
        return "rune";
      default:
        return "placeholder";
    }
  };

  return (
    <div class={"item-list" + (props.smallDisplay ? " item-list--small" : "")}>
      <div class="w-[800px]" onClick={() => setSelectedItemIndex(undefined)}>
        <For each={range(0, props.listSize)}>
          {index => (
            <Switch>
              <Match when={!props.items[index]}>
                <Show when={!props.hideEmpty}>
                  <span class="item-slot"></span>
                </Show>
              </Match>
              <Match when={props.items[index]}>
                <Popup content={() => <ItemStats item={props.items[index]} />}>
                  <span
                    class={"item-slot" + (selectedItemIndex() === index ? " item-slot-selected" : "")}
                    onClick={event => itemClick(event, index)}
                  >
                    <Asset id={getAssetId(index)} size="icon" />
                  </span>
                </Popup>
              </Match>
            </Switch>
          )}
        </For>
      </div>
    </div>
  );
};
