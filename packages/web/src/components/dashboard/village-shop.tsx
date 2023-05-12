import { useGameStateSelector, villageShopSelector } from "@web/store/game";

import { ItemList } from "./item-list";

export const VillageShopPage = () => {
  const shop = useGameStateSelector(villageShopSelector);

  if (!shop) return <div>No shop!</div>;

  return <ItemList items={shop.items.map(x => x.item)} listSize={30} />;
};
