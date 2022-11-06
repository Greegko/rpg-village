import { range } from "ramda";
import { MouseEvent, useEffect, useState } from "react";
import { useCallback } from "react";

import { Item, ItemType } from "@rpg-village/core";

import { Asset } from "../core";
import { Popup } from "../core/popup/popup";
import { ItemStats } from "./item-stats";

import "./item-list.scss";

export interface ItemListProperties {
  items: Item[];
  listSize: number;
  hideEmpty?: boolean;
  smallDisplay?: boolean;
  onItemSelect?: (item: Item | null) => void;
}

export const ItemList = ({ items, onItemSelect, listSize, smallDisplay, hideEmpty }: ItemListProperties) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>();

  useEffect(() => setSelectedItemIndex(null), [items]);

  const itemClick = useCallback(
    (event: MouseEvent, index: number) => {
      if (!onItemSelect) return;

      event.stopPropagation();

      if (index === selectedItemIndex) return;

      if (items[index]) {
        setSelectedItemIndex(index);
        onItemSelect?.(items[index]);
      } else {
        onItemSelect?.(null);
      }
    },
    [selectedItemIndex, items, onItemSelect],
  );

  const getAssetId = useCallback(
    (index: number) => {
      if (!items || !items[index]) return "placeholder";

      switch (items[index].itemType) {
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
    },
    [items],
  );

  return (
    <div className={"item-list" + (smallDisplay ? " item-list--small" : "")}>
      <div className="items" onClick={() => setSelectedItemIndex(undefined)}>
        {range(0, listSize).map(index => {
          if (!items[index]) return hideEmpty ? null : <span key={index} className="item-slot"></span>;

          return (
            <Popup key={index} content={() => <ItemStats item={items[index]} />}>
              <span
                className={"item-slot" + (selectedItemIndex === index ? " item-slot-selected" : "")}
                onClick={event => itemClick(event, index)}
              >
                <Asset id={getAssetId(index)} size="icon" />
              </span>
            </Popup>
          );
        })}
      </div>
    </div>
  );
};
