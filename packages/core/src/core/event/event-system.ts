import { inject, injectable } from "inversify";
import { forEach } from "rambda";

import { GetInjectionToken } from "../module";
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

  constructor(@inject(GetInjectionToken) private getInjector: (functor: any) => any) {}

  hookEventHandlers() {
    EventSystem.eventHandlerDecorators!.forEach(handler => {
      const instance = this.getInjector(handler.targetClass.constructor) as any;

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
