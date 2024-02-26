import { AnyActivity } from "./activity";
import { IActivityHandler, IActivityHandlerCancelable } from "./activity-handler";

export type GetActivityHandlerByName = (
  name: string,
) => IActivityHandler<AnyActivity> | IActivityHandlerCancelable<AnyActivity>;
