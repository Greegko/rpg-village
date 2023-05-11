import { injectable } from "inversify";

import { EntityStore } from "@core/store";

import { ShopID, ShopState } from "./interfaces/shop-store";

@injectable()
export class ShopStore extends EntityStore<ShopID, ShopState> {}
