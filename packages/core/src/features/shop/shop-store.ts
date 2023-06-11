import { injectable } from "inversify";

import { EntityStore } from "@core";

import { ShopID, ShopState } from "./interfaces/shop-store";

@injectable()
export class ShopStore extends EntityStore<ShopID, ShopState> {}
