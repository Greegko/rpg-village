import { injectable } from 'inversify';
import { forEach } from 'ramda';
import { EventHandler } from '../models';

export interface EventSystem {
  on(eventType: string, callback: Function);
  fire(eventType: string, args?: any);
  hookEventHandlers(eventHandlers: EventHandler[]);
}

@injectable()
export class EventSystem {

  private _subscribers: { [key: string]: Function[] } = {};

  hookEventHandlers(eventHandlers: EventHandler[]) {
    forEach(eventHandler => eventHandler.init(this), eventHandlers);
  }

  on(eventType: string, callback: Function) {
    if (!this._subscribers[eventType])
      this._subscribers[eventType] = [];

    this._subscribers[eventType].push(callback);
  }

  fire(eventType: string, args?: any) {
    forEach(callback => callback(args), this._subscribers[eventType] || []);
  }

}
