import { forEach } from "ramda";
import { inject, injectable } from "inversify";

interface EventHandlerDecoratorSubscription {
  event: any;
  targetClass: any;
  handlerFunctionName: string;
}

@injectable()
export class EventSystem {
  static eventHandlerDecorators: EventHandlerDecoratorSubscription[] | null = [];

  private subscribers: { [key: string]: Function[] } = {};

  constructor(@inject("getInjection") private getInjector: (functor: any) => any) {}

  hookEventHandlers() {
    EventSystem.eventHandlerDecorators!.forEach(handler => {
      const instance = this.getInjector(handler.targetClass.constructor) as any;

      this.on(handler.event, (args: any) => instance[handler.handlerFunctionName](args));
    });
  }

  on(eventType: string, eventHandlerFunction: Function): void {
    if (!this.subscribers[eventType]) this.subscribers[eventType] = [];

    this.subscribers[eventType].push(eventHandlerFunction);
  }

  fire(eventType: string, args?: any): void {
    forEach(callback => callback(args), this.subscribers[eventType] || []);
  }
}
