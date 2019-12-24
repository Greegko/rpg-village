import { PartyID } from '../../../../core-src';

export type ActivityTask<T> = {
  state: T;
  partyId: PartyID;
  type: string;
}
