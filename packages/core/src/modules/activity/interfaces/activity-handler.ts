import { Activity, PartyActivityStartArgs } from "./activity";

export interface IActivityHandler<StaringArgs extends PartyActivityStartArgs, ActivityState> {
  start(startArgs: StaringArgs): ActivityState;
  isRunnable(startArgs: StaringArgs): boolean;
  isDone(activity: Activity<ActivityState>): boolean;
  execute(activity: Activity<ActivityState>): ActivityState;
  resolve(activity: Activity<ActivityState>): void;
}
