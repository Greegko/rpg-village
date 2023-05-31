import { ShopCommand } from "@modules/shop";

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

test("should decrease quantity", {
  initState: createState(({ shop, village }) => [
    shop({
      id: "shop-id",
      items: [{ id: "shop-item-id", price: { gold: 50 }, quantity: 2, item: { name: "shop-buy-item" } }],
    }),
    village({ stash: { resource: { gold: 100 }, items: [] } }),
  ]),
  commands: [{ command: ShopCommand.BuyItem, args: { shopId: "shop-id", shopItemId: "shop-item-id" } }],
  expectedState: (state, t) => t.is(state.shops["shop-id"].items.find(x => x.id === "shop-item-id").quantity, 1),
});

test("should remove item when runs out", {
  initState: createState(({ shop, village }) => [
    shop({
      id: "shop-id",
      items: [{ id: "shop-item-id", price: { gold: 50 }, quantity: 1, item: {} }],
    }),
    village({ stash: { resource: { gold: 100 }, items: [] } }),
  ]),
  commands: [{ command: ShopCommand.BuyItem, args: { shopId: "shop-id", shopItemId: "shop-item-id" } }],
  expectedState: (state, t) =>
    t.is(
      state.shops["shop-id"].items.find(x => x.id === "shop-item-id"),
      undefined,
    ),
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
