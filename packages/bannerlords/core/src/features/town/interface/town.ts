import { Stash } from "@features/item";
import { LordID } from "@features/lord";
import { PartyID } from "@features/party";
import { Unit } from "@features/unit";

export type TownID = string;
export interface Town {
  id: TownID;
  name: string;
  belongTo: LordID;
  prosperity: number;
  garrison: Unit[];
  parties: PartyID[];
  stash: Stash;
}
