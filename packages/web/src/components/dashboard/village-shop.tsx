import { useState } from "react";

import { Item, VillageBuildingCommand, VillageID } from "@rpg-village/core";

import { useGameExecuteCommand } from "@web/react-hooks";
import { useGameStateSelector, villageByIdSelector } from "@web/store/game";

import { ItemList } from "./item-list";

export const VillageShopPage = (props: { villageId: VillageID }) => {
  const execute = useGameExecuteCommand();
  const [selectedItem, setSelectedItem] = useState<Item | null>();
  const village = useGameStateSelector(state => villageByIdSelector(state, props.villageId));
  const shop = village.buildings.shop;

  if (!shop) return <div>No shop!</div>;

  return (
    <>
      {selectedItem && (
        <button
          onClick={() =>
            execute({
              command: VillageBuildingCommand.ShopBuyItem,
              args: { villageId: props.villageId, shopItemId: shop.items.find(x => x.item === selectedItem)?.id! },
            })
          }
        >
          Buy
        </button>
      )}
      <ItemList onItemSelect={setSelectedItem} items={shop.items.map(x => x.item)} listSize={30} />
    </>
  );
};
