import { Stash } from "@features/item";
import { LordID } from "@features/lord";
import { Unit } from "@features/unit";

export type CastleID = string;
export interface Castle {
  id: CastleID;
  name: string;
  belongTo: LordID;
  garrison: Unit[];
  stash: Stash;
}
