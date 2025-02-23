import { createInjectableToken, makeInjectable } from "@rpg-village/core";

import { ActivityHandlerClass } from "./interfaces";

export const ActivityHandlersToken = createInjectableToken<ActivityHandlerClass>("ActivityHandlersToken");

export const injectableActivity = (name: string) => {
  return <T extends ActivityHandlerClass>(target: T) => makeInjectable(ActivityHandlersToken, target, { name });
};
