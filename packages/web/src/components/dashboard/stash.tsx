import { MouseEvent, useState } from "react";
import { useCallback } from "react";

import { Item } from "@rpg-village/core";

import "./stash.scss";

export interface StashProperties {
  items: Item[];
  onItemSelect: (item: Item) => void;
}

const ITEMS_PER_PAGE = 128;
const ITEM_GRID_ARRAY = Array(ITEMS_PER_PAGE).fill(null);

export const Stash = ({ items, onItemSelect }: StashProperties) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>();

  const itemClick = useCallback(
    (event: MouseEvent, index: number) => {
      if (index === selectedItemIndex) return;

      if (items[index]) {
        event.stopPropagation();
        setSelectedItemIndex(index);
        onItemSelect(items[index]);
      }
    },
    [selectedItemIndex, items, onItemSelect],
  );

  return (
    <div className="stash">
      <div className="items" onClick={() => setSelectedItemIndex(undefined)}>
        {ITEM_GRID_ARRAY.map((_, index) => (
          <div
            key={index}
            className={"item-slot" + (selectedItemIndex === index ? " item-slot-selected" : "")}
            onClick={event => itemClick(event, index)}
          >
            {items[index]?.id}
          </div>
        ))}
      </div>
    </div>
  );
};
