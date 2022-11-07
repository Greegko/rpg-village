import { PartyID } from "@modules/party";

export type ActivityID = string;
export enum ActivityType {
  Party = "party",
}

export type Activity<State = unknown, StartingArgs = unknown> = {
  id: ActivityID;
  state: State;
  name: string;
  startArgs: StartingArgs;
  type: ActivityType;
};

export type AnyActivity = Activity<any, any>;

export type PartyActivityStartArgs = {
  partyId: PartyID;
  involvedPartyId?: PartyID;
};

export type PartyActivity<T = unknown> = Activity<T, PartyActivityStartArgs> & {
  type: ActivityType.Party;
};
