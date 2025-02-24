import { forEach } from "rambda";

import { inject, injectable } from "@lib/dependency-injection";

import { EventType } from "@rpg-village/core/extend";

import { eventHandlersToken } from "./event-handlers-token";

@injectable()
export class EventSystem {
  private subscribers: Partial<Record<keyof EventType, Function[]>> = {};

  constructor() {
    const eventHandlers = (() => {
      try {
        return inject(eventHandlersToken, { multi: true });
      } catch {
        return [];
      }
    })();

    eventHandlers.forEach(handler =>
      this.on(handler.eventType, (args: any) => inject(handler.targetInstance.constructor)[handler.handlerFunctionName](args)),
    );
  }

  on<T extends keyof EventType>(eventType: T, eventHandlerFunction: (args?: EventType[T]) => void): void {
    if (!this.subscribers[eventType]) this.subscribers[eventType] = [];

    this.subscribers[eventType]!.push(eventHandlerFunction);
  }

  fire<T extends keyof EventType>(eventType: T, args?: EventType[T]): void {
    forEach(callback => callback(args), this.subscribers[eventType] || []);
  }
}
