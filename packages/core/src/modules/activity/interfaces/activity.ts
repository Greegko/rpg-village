export type ActivityID = string;
export enum ActivityType {
  Party = "party",
}
export type Activity<T = unknown, S = unknown> = {
  id: ActivityID;
  state: T;
  name: string;
  startArgs: S;
  type: ActivityType;
};

export type PartyActivityStartArgs = {
  partyId: string;
  involvedPartyId?: string;
};
export type PartyActivity<T = unknown> = Activity<T> & {
  state: T;
  startArgs: PartyActivityStartArgs;
  type: ActivityType.Party;
};
