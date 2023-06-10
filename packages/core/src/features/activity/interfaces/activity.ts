export type ActivityID = string;
export enum ActivityType {
  Global = "global",
}

export type ActivityBase<State = unknown, StartingArgs = unknown> = {
  id: ActivityID;
  state: State;
  name: string;
  startArgs: StartingArgs;
  type: ActivityType;
};

export interface GlobalActivity<State = unknown, StartingArgs = unknown> extends ActivityBase<State, StartingArgs> {
  type: ActivityType.Global;
}

export interface ActivityValues<State = unknown, StartingArgs = unknown> {
  GlobalActivity: GlobalActivity<State, StartingArgs>;
}

export type Activity<State = unknown, StartingArgs = unknown> = ActivityValues<
  State,
  StartingArgs
>[keyof ActivityValues];
