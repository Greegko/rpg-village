import { inject, injectable } from "@lib/dependency-injection";

import { CommandType } from "@rpg-village/core/extend";

import { commandHandlersToken } from "./command-handlers-token";

@injectable()
export class CommandSystem {
  private subscribers: { [key: string]: Function } = {};

  constructor() {
    const commandHandlers = (() => {
      try {
        return inject(commandHandlersToken, { multi: true });
      } catch {
        return [];
      }
    })();

    commandHandlers.forEach(handler =>
      this.on(handler.commandType, (args: any) => inject(handler.targetInstance.constructor)[handler.handlerFunctionName](args)),
    );
  }

  on<T extends keyof CommandType>(commandType: T, callback: (args?: CommandType[T]) => void) {
    this.subscribers[commandType] = callback;
  }

  execute<T extends keyof CommandType>(commandType: T, args?: CommandType[T]) {
    this.subscribers[commandType](args);
  }
}
