import { Type, createInjectableToken } from "@lib/dependency-injection";

import { EventType } from "@rpg-village/core/extend";

export interface EventHandler {
  eventType: keyof EventType;
  targetInstance: InstanceType<Type>;
  handlerFunctionName: string;
}

export const eventHandlersToken = createInjectableToken<EventHandler>("EventHandlersToken");
