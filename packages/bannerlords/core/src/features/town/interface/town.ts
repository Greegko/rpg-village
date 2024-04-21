import { Stash } from "@features/item";
import { LordID } from "@features/lord";
import { Unit } from "@features/unit";

export type TownID = string;
export interface Town {
  id: TownID;
  name: string;
  belongTo: LordID;
  prosperity: number;
  garrison: Unit[];
  stash: Stash;
}
