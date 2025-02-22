import { forEach } from "rambda";

import { inject, injectable } from "@lib/dependency-injection";

import { EventType } from "./event-type";

interface EventHandlerDecoratorSubscription {
  event: any;
  targetClass: any;
  handlerFunctionName: string;
}

@injectable()
export class EventSystem {
  static eventHandlerDecorators: EventHandlerDecoratorSubscription[] | null = [];

  private subscribers: Partial<Record<keyof EventType, Function[]>> = {};

  hookEventHandlers() {
    EventSystem.eventHandlerDecorators!.forEach(handler => {
      const instance = inject(handler.targetClass.constructor) as any;

      // @ts-ignore
      this.on(handler.event, (args: any) => instance[handler.handlerFunctionName](args));
    });
  }

  on<T extends keyof EventType>(eventType: T, eventHandlerFunction: (args?: EventType[T]) => void): void {
    // @ts-ignore
    if (!this.subscribers[eventType]) this.subscribers[eventType] = [];

    this.subscribers[eventType]!.push(eventHandlerFunction);
  }

  fire<T extends keyof EventType>(eventType: T, args?: EventType[T]): void {
    // @ts-ignore
    forEach(callback => callback(args), this.subscribers[eventType] || []);
  }
}
