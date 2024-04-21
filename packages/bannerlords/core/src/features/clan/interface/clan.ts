import { FractionID } from "@features/fraction";

export type ClanID = string;
export interface Clan {
  id: ClanID;
  name: string;
  belongTo: FractionID;
}
