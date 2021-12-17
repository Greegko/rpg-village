import { EventSystem } from "./event-system";
import { EventType } from "./event-type";

export function eventHandler(eventType: keyof EventType) {
  return (targetClass: any, handlerFunctionName: string) => {
    EventSystem.eventHandlerDecorators!.push({
      event: eventType,
      targetClass,
      handlerFunctionName,
    });
  };
}
