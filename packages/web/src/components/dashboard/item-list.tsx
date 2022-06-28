import { range } from "ramda";
import { MouseEvent, useState } from "react";
import { useCallback } from "react";

import { Item, ItemType } from "@rpg-village/core";

import { Asset } from "../core";

import "./item-list.scss";

export interface ItemListProperties {
  items: Item[];
  listSize: number;
  smallDisplay?: boolean;
  onItemSelect?: (item: Item) => void;
}

export const ItemList = ({ items, onItemSelect, listSize, smallDisplay }: ItemListProperties) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>();

  const itemClick = useCallback(
    (event: MouseEvent, index: number) => {
      if (index === selectedItemIndex) return;

      if (items[index]) {
        event.stopPropagation();
        setSelectedItemIndex(index);
        onItemSelect?.(items[index]);
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
        default:
          return "placeholder";
      }
    },
    [items],
  );

  return (
    <div className={"item-list" + (smallDisplay ? " item-list--small" : "")}>
      <div className="items" onClick={() => setSelectedItemIndex(undefined)}>
        {range(0, listSize).map(index => (
          <div
            key={index}
            className={"item-slot" + (selectedItemIndex === index ? " item-slot-selected" : "")}
            onClick={event => itemClick(event, index)}
          >
            <Asset id={getAssetId(index)} size="icon" />
          </div>
        ))}
      </div>
    </div>
  );
};
