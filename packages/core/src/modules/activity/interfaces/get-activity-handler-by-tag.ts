import { Activity } from "./activity";
import { IActivityHandler, IActivityHandlerCancelable } from "./activity-handler";

export type GetActivityHandlerByName = (
  name: string,
) => IActivityHandler<Activity> | IActivityHandlerCancelable<Activity>;
