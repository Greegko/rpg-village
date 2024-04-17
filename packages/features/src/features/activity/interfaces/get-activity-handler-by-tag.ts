import { AnyActivity } from "./activity";
import { ActivityHandler, ActivityHandlerCancelable } from "./activity-handler";

export type GetActivityHandlerByName = (
  name: string,
) => ActivityHandler<AnyActivity> | ActivityHandlerCancelable<AnyActivity>;
