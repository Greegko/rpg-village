import { PartyID } from "@modules/party";

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
  partyId: PartyID;
  involvedPartyId?: PartyID;
};
export type PartyActivity<T = unknown> = Activity<T, PartyActivityStartArgs> & {
  state: T;
  type: ActivityType.Party;
};
