import { IActivityTaskHandler } from "./activity-task-handler";

export type GetActivityHandlerByTag = (tag: string) => IActivityTaskHandler<any, any>
