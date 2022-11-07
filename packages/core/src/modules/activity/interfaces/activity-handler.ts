import { Activity } from "./activity";

export interface IActivityHandler<A extends Activity> {
  start(startArgs: A['startArgs']): A['state'];
  isRunnable(startArgs: A['startArgs']): boolean;
  isDone(activity: Activity): boolean;
  execute(activity: Activity): A['state'];
  resolve(activity: Activity): void;
}
