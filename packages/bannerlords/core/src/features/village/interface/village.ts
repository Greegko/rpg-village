import { CastleID } from "@features/castle";
import { Product, Stash } from "@features/item";
import { TownID } from "@features/town";

export type VillageID = string;
export interface Village {
  id: VillageID;
  name: string;
  prosperity: number;
  produce: Product;
  belongTo: CastleID | TownID;
  stash: Stash;
}
