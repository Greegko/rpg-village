import { Stash } from "@features/item";
import { Unit } from "@features/unit";

export type PartyID = string;

export type EntityID = string;

export interface Party {
  id: PartyID;
  units: Unit[];
  stash: Stash;
  belongTo: EntityID;
}
