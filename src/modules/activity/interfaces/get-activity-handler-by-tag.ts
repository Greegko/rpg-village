import { IActivityHandler } from "./activity-handler";

export type GetActivityHandlerByTag = (tag: string) => IActivityHandler<any, any>
