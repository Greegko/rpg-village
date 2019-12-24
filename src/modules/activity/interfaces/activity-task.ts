import { PartyID } from '../../party';

export type ActivityTask<T> = {
  state: T;
  partyId: PartyID;
  type: string;
}
