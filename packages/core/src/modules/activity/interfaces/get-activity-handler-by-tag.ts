import { Activity } from "./activity";
import { IActivityHandler } from "./activity-handler";

export type GetActivityHandlerByName = (name: string) => IActivityHandler<Activity>;
