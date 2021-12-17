import { EventSystem } from "./event-system";

export function eventHandler(event: any) {
  return (targetClass: any, handlerFunctionName: string) => {
    EventSystem.eventHandlerDecorators!.push({
      event,
      targetClass,
      handlerFunctionName,
    });
  };
}
