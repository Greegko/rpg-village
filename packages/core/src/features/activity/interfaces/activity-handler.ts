import { AnyActivity } from "./activity";

export interface IActivityHandler<T extends AnyActivity> {
  start(startArgs: T["startArgs"]): T["state"];
  isRunnable(startArgs: T["startArgs"]): boolean;
  isDone(activity: T): boolean;
  execute(activity: T): T["state"];
  resolve(activity: T): void;
}

export interface IActivityHandlerCancelable<T extends AnyActivity> extends IActivityHandler<T> {
  isCancelable(activity: T): boolean;
  onCancel(activity: T): void;
}
