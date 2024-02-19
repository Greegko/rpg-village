export type ActivityID = string;

export type Activity<State = unknown, StartingArgs = unknown> = {
  id: ActivityID;
  state: State;
  name: string;
  startArgs: StartingArgs;
};
