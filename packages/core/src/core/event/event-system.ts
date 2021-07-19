import { injectable } from 'inversify';
import { forEach } from 'ramda';
import { EventHandler } from './event-handler';

export interface EventSystem {
  on(eventType: string, callback: Function): void;
  fire(eventType: string, args?: any): void;
  hookEventHandlers(eventHandlers: EventHandler[]): void;
}

@injectable()
export class EventSystem {
  private subscribers: { [key: string]: Function[] } = {};

  hookEventHandlers(eventHandlers: EventHandler[]) {
    forEach(eventHandler => eventHandler.init(this), eventHandlers);
  }

  on(eventType: string, eventHandlerFunction: Function): void {
    if (!this.subscribers[eventType])
      this.subscribers[eventType] = [];

    this.subscribers[eventType].push(eventHandlerFunction);
  }

  fire(eventType: string, args?: any): void {
    forEach(callback => callback(args), this.subscribers[eventType] || []);
  }
}