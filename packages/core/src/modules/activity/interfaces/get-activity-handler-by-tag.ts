import { AnyActivity } from "./activity";
import { IActivityHandler } from "./activity-handler";

export type GetActivityHandlerByName = (name: string) => IActivityHandler<AnyActivity>;
