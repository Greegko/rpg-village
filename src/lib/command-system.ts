import { injectable } from 'inversify';
import { forEach } from 'ramda';
import { CommandHandler } from '../models';

export interface CommandSystem {
  on(commandType: string, callback: Function);
  execute(commandType: string, args?: any);
  hookCommandHandlers(commandHandlers: CommandHandler[]);
}

@injectable()
export class CommandSystem {
  private _subscribers: { [key: string]: Function } = {};

  hookCommandHandlers(commandHandlers: CommandHandler[]) {
    forEach(commandHandler => commandHandler.init(this), commandHandlers);
  }

  on(commandType: string, callback: Function) {
    this._subscribers[commandType] = callback;
  }

  execute(commandType: string, args?: any) {
    this._subscribers[commandType](args);
  }
}
