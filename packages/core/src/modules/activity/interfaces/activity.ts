import { PartyID } from "@modules/party";

export type ActivityID = string;
export enum ActivityType {
  Party = "party",
  Global = "global"
}

type ActivityBase<State = unknown, StartingArgs = unknown> = {
  id: ActivityID;
  state: State;
  name: string;
  startArgs: StartingArgs;
  type: ActivityType;
};

export type PartyActivityStartArgs = {
  partyId: PartyID;
  involvedPartyId?: PartyID;
};

export interface GlobalActivity<State = unknown, StartingArgs = unknown> extends ActivityBase<State, StartingArgs>  {
  type: ActivityType.Global;

}

export interface PartyActivity<State = unknown, StartingArgs = unknown> extends ActivityBase<State, PartyActivityStartArgs & StartingArgs> {
  type: ActivityType.Party;
};

export type Activity<State = unknown, StartingArgs = unknown> = GlobalActivity<State, StartingArgs> | PartyActivity<State, StartingArgs>;
