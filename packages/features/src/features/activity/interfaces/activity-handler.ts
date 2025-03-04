import { Type } from "@rpg-village/core";

import { AnyActivity } from "./activity";

export interface ActivityHandler<T extends AnyActivity> {
  start(startArgs: T["startArgs"]): T["state"];
  isRunnable(startArgs: T["startArgs"]): boolean;
  isDone(activity: T): boolean;
  execute(activity: T): T["state"];
  resolve(activity: T): void;
}

export interface ActivityHandlerCancelable<T extends AnyActivity> extends ActivityHandler<T> {
  isCancelable(activity: T): boolean;
  onCancel(activity: T): void;
}

export type ActivityHandlerClass = Type<ActivityHandler<AnyActivity> | ActivityHandlerCancelable<AnyActivity>>;
