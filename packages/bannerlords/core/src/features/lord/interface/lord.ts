import { ClanID } from "@features/clan";
import { Stash } from "@features/item";

export type LordID = string;
export interface Lord {
  id: LordID;
  name: string;
  belongTo: ClanID;
  stash: Stash;
}
