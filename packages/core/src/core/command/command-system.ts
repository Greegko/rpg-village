import { injectable } from 'inversify';
import { forEach } from 'ramda';
import { CommandHandler } from './command-handler';

export interface CommandSystem {
  on(commandType: string, callback: Function): void;
  execute(commandType: string, args?: any): void;
  hookCommandHandlers(commandHandlers: CommandHandler[]): void;
}

@injectable()
export class CommandSystem {
  private subscribers: { [key: string]: Function } = {};

  hookCommandHandlers(commandHandlers: CommandHandler[]) {
    forEach(commandHandler => commandHandler.init(this), commandHandlers);
  }

  on(commandType: string, callback: Function) {
    this.subscribers[commandType] = callback;
  }

  execute(commandType: string, args?: any) {
    this.subscribers[commandType](args);
  }
}