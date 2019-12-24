import { PartyID } from "../../../../core-src";

export type Command = {
  partyId: PartyID;
  command: string;
  args?: any;
};
