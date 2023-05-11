import { Module } from "@core/module";

import { ShopCommandHandler } from "./shop-command-handler";
import { ShopStore } from "./shop-store";

export const shopModule: Module = {
  provides: [ShopCommandHandler],
  stores: [{ scope: "shops", store: ShopStore }],
};
