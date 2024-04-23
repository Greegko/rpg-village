import { ClanID } from "@features/clan";

export type LordID = string;
export interface Lord {
  id: LordID;
  name: string;
  belongTo: ClanID;
  gold: number;
}
