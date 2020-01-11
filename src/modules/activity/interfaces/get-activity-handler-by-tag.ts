import { IActivityHandler } from "./activity-handler";

export type GetActivityHandlerByTag = (tag: string) => IActivityHandler<unknown, unknown>
