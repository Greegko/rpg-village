import { PartyID } from '../../party';

export type ActivityID = string;
export type AnyActivity = Activity<any>;
export type Activity<T> = {
  state: T;
  partyId: PartyID;
  type: string;
}
