import { EventType } from "../global-type/event-type";
import { EventSystem } from "./event-system";

export function eventHandler(eventType: keyof EventType) {
  return (targetClass: any, handlerFunctionName: string) => {
    EventSystem.eventHandlerDecorators!.push({
      event: eventType,
      targetClass,
      handlerFunctionName,
    });
  };
}
