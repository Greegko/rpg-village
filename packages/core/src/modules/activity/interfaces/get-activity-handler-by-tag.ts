import { IActivityHandler } from "./activity-handler";

export type GetActivityHandlerByName = (name: string) => IActivityHandler<any, any>;
