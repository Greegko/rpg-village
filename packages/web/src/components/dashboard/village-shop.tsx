import { useState } from "react";

import { Item, ShopCommand } from "@rpg-village/core";

import { useGameExecuteCommand } from "@web/react-hooks";
import { useGameStateSelector, villageShopSelector } from "@web/store/game";

import { ItemList } from "./item-list";

export const VillageShopPage = () => {
  const execute = useGameExecuteCommand();
  const [selectedItem, setSelectedItem] = useState<Item | null>();
  const shop = useGameStateSelector(villageShopSelector);

  if (!shop) return <div>No shop!</div>;

  return (
    <>
      {selectedItem && (
        <button
          onClick={() =>
            execute({
              command: ShopCommand.BuyItem,
              args: { shopId: shop.id, shopItemId: shop.items.find(x => x.item === selectedItem)?.id! },
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
