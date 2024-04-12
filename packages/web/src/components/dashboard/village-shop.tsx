import { Show, createSignal } from "solid-js";

import { Item, VillageBuildingCommand, VillageID } from "@rpg-village/core";

import { useGameExecuteCommand } from "@web/engine";
import { useGameStateSelector, villageByIdSelector } from "@web/store/game";

import { ItemList } from "./item-list";

export const VillageShopPage = (props: { villageId: VillageID }) => {
  const execute = useGameExecuteCommand();
  const [selectedItem, setSelectedItem] = createSignal<Item | null>();
  const village = useGameStateSelector(state => villageByIdSelector(state, props.villageId));
  const shop = () => village().buildings.shop;

  return (
    <Show when={shop()} fallback={<span>No Shop</span>}>
      <Show when={selectedItem()}>
        <button
          onClick={() =>
            execute({
              command: VillageBuildingCommand.ShopBuyItem,
              args: { villageId: props.villageId, shopItemId: selectedItem()!.id },
            })
          }
        >
          Buy
        </button>
      </Show>
      <ItemList onItemSelect={setSelectedItem} items={shop()!.items.map(x => x.item)} listSize={30} />
    </Show>
  );
};
