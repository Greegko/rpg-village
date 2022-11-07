import { Activity } from "./activity";

export interface IActivityHandler<T extends Activity> {
  start(startArgs: T['startArgs']): T['state'];
  isRunnable(startArgs: T['startArgs']): boolean;
  isDone(activity: T): boolean;
  execute(activity: T): T['state'];
  resolve(activity: T): void;
}
