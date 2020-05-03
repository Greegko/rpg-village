export type ActivityID = string;
export type AnyActivity = Activity<unknown>;
export enum ActivityType { Party = 'party' };
export type Activity<T = unknown> = {
  id: ActivityID;
  state: T;
  name: string;
  type: ActivityType;
}

export type PartyActivity<T = unknown> = Activity<T> & {
  state: T & { partyId: string };
  type: ActivityType.Party;
}
