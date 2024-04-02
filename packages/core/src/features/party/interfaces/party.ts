import { Stash } from "@features/stash";
import { UnitID } from "@features/unit";

import { PartyOwner } from "./party-owner";

export type PartyID = string & { __typeGuard: "party-id" };

export interface Party {
  id: PartyID;
  owner: PartyOwner;
  unitIds: UnitID[];
  stash: Stash;
}
