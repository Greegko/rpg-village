import { PartyID } from '@greegko/rpg-model';

export type Command = {
  partyId: PartyID;
  command: string;
  args?: any;
};
