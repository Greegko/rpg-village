import { PartyID } from '@greegko/rpg-model';

export type ActivityTask<T> = {
  state: T;
  partyId: PartyID;
  type: string;
}
