import { Activity } from './activity';

export interface IActivityHandler<StaringArgs, ActivityState> {
  start(startArgs: StaringArgs): ActivityState;
  isRunnable(startArgs: StaringArgs): boolean;
  isDone(activity: Activity<ActivityState>): boolean;
  execute(activity: Activity<ActivityState>): ActivityState;
  resolve(activity: Activity<ActivityState>);
}
