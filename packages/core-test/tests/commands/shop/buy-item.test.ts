import { ShopCommand } from "@rpg-village/core/dist/src/modules/shop/interfaces/village-command";

import { createState, test } from "../../utils";

test("should remove resoure when village has enough resource", {
  initState: createState(({ shop, village }) => [
    shop({
      id: "shop-id",
      items: [{ id: "shop-item-id", price: { gold: 50 }, quantity: 1, item: { name: "shop-buy-item" } }],
    }),
    village({ stash: { resource: { gold: 100 }, items: [] } }),
  ]),
  commands: [{ command: ShopCommand.BuyItem, args: { shopId: "shop-id", shopItemId: "shop-item-id" } }],
  expectedState: { village: { stash: { resource: { gold: 50 } } } },
});

test("should put into village items", {
  initState: createState(({ shop, village }) => [
    shop({
      id: "shop-id",
      items: [{ id: "shop-item-id", price: { gold: 50 }, quantity: 1, item: { name: "shop-buy-item" } }],
    }),
    village({ stash: { resource: { gold: 100 }, items: [] } }),
  ]),
  commands: [{ command: ShopCommand.BuyItem, args: { shopId: "shop-id", shopItemId: "shop-item-id" } }],
  expectedState: { village: { stash: { items: [{ name: "shop-buy-item" }] } } },
});
