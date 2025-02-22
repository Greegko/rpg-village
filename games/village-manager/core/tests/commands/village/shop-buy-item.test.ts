import { VillageBuildingCommand } from "@/features/village";
import { createState, test } from "@test/utils";
import { expect } from "vitest";

test("should remove resoure when village has enough resource", {
  initState: createState(({ village }) => [
    village({
      id: "villageId",
      stash: { resource: { gold: 100 }, items: [] },
      buildings: {
        shop: { items: [{ id: "shop-item-id", price: { gold: 50 }, quantity: 1, item: { name: "shop-buy-item" } }] },
      },
    }),
  ]),
  commands: [{ command: VillageBuildingCommand.ShopBuyItem, args: { villageId: "villageId", shopItemId: "shop-item-id" } }],
  expectedState: { villages: { villageId: { stash: { resource: { gold: 50 } } } } },
});

test("should decrease quantity", {
  initState: createState(({ village }) => [
    village({
      id: "villageId",
      stash: { resource: { gold: 100 }, items: [] },
      buildings: {
        shop: { items: [{ id: "shop-item-id", price: { gold: 50 }, quantity: 2, item: { name: "shop-buy-item" } }] },
      },
    }),
  ]),
  commands: [{ command: VillageBuildingCommand.ShopBuyItem, args: { villageId: "villageId", shopItemId: "shop-item-id" } }],
  expectedState: state => expect(state.villages.villageId.buildings.shop!.items.find(x => x.id === "shop-item-id")!.quantity).toBe(1),
});

test("should remove item when runs out", {
  initState: createState(({ village }) => [
    village({
      id: "villageId",
      stash: { resource: { gold: 100 }, items: [] },
      buildings: { shop: { items: [{ id: "shop-item-id", price: { gold: 50 }, quantity: 1, item: {} }] } },
    }),
  ]),
  commands: [{ command: VillageBuildingCommand.ShopBuyItem, args: { villageId: "villageId", shopItemId: "shop-item-id" } }],
  expectedState: state => expect(state.villages.villageId.buildings.shop!.items.find(x => x.id === "shop-item-id")).toBeUndefined(),
});

test("should put into village items", {
  initState: createState(({ village }) => [
    village({
      id: "villageId",
      stash: { resource: { gold: 100 }, items: [] },
      buildings: {
        shop: { items: [{ id: "shop-item-id", price: { gold: 50 }, quantity: 1, item: { name: "shop-buy-item" } }] },
      },
    }),
  ]),
  commands: [{ command: VillageBuildingCommand.ShopBuyItem, args: { villageId: "villageId", shopItemId: "shop-item-id" } }],
  expectedState: { villages: { villageId: { stash: { items: [{ name: "shop-buy-item" }] } } } },
});

test("should add price value into shop resource", {
  initState: createState(({ village }) => [
    village({
      id: "villageId",
      stash: { resource: { gold: 100 }, items: [] },
      buildings: {
        shop: {
          stash: { resource: { gold: 0 } },
          items: [{ id: "shop-item-id", price: { gold: 50 }, quantity: 1, item: { name: "shop-buy-item" } }],
        },
      },
    }),
  ]),
  commands: [{ command: VillageBuildingCommand.ShopBuyItem, args: { villageId: "villageId", shopItemId: "shop-item-id" } }],
  expectedState: { villages: { villageId: { buildings: { shop: { stash: { resource: { gold: 50 } } } } } } },
});
