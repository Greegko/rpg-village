import { PartyID } from "../../party";

export type Command = {
  partyId: PartyID;
  command: string;
  args?: any;
};
