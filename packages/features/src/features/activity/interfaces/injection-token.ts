import { ActivityHandlersToken as ActivityHandlersTokenCore, InjectableToken } from "@rpg-village/core";

import { ActivityHandler, ActivityHandlerCancelable } from "./activity-handler";

export const ActivityHandlersToken = ActivityHandlersTokenCore as InjectableToken<ActivityHandlerCancelable<any> | ActivityHandler<any>>;
