import { injectable } from 'inversify';
import { forEach } from 'ramda';
import { EventHandler } from '../models';

export interface EventSystem {
  on(eventType: string, callback: Function): void;
  fire(eventType: string, args?: any): void;
  hookEventHandlers(eventHandlers: EventHandler[]);
}

@injectable()
export class EventSystem {
  private _subscribers: { [key: string]: Function[] } = {};

  hookEventHandlers(eventHandlers: EventHandler[]) {
    forEach(eventHandler => eventHandler.init(this), eventHandlers);
  }

  on(eventType: string, eventHandlerFunction: Function): void {
    if (!this._subscribers[eventType])
      this._subscribers[eventType] = [];

    this._subscribers[eventType].push(eventHandlerFunction);
  }

  fire(eventType: string, args?: any): void {
    forEach(callback => callback(args), this._subscribers[eventType] || []);
  }
}
