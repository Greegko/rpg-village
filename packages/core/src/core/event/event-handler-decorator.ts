import { Type, makeInjectable } from "@lib/dependency-injection";

import { EventType } from "@rpg-village/core/extend";

import { eventHandlersToken } from "./event-handlers-token";

export function eventHandler(eventType: keyof EventType) {
  return (targetInstance: InstanceType<Type>, handlerFunctionName: string) => {
    makeInjectable(
      eventHandlersToken,
      {
        eventType,
        targetInstance,
        handlerFunctionName,
      },
      { multi: true },
    );
  };
}
