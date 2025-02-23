import { Type, inject, injectable } from "@lib/dependency-injection";

import { CommandType } from "@rpg-village/core/extend";

export interface CommandHandler {
  commandType: keyof CommandType;
  targetInstance: InstanceType<Type>;
  handlerFunctionName: string;
}

@injectable()
export class CommandSystem {
  private subscribers: { [key: string]: Function } = {};

  registerCommand(commandHandler: CommandHandler): void {
    this.on(commandHandler.commandType, (args: any) => {
      inject(commandHandler.targetInstance.constructor)[commandHandler.handlerFunctionName](args);
    });
  }

  on<T extends keyof CommandType>(commandType: T, callback: (args?: CommandType[T]) => void) {
    this.subscribers[commandType] = callback;
  }

  execute<T extends keyof CommandType>(commandType: T, args?: CommandType[T]) {
    this.subscribers[commandType](args);
  }
}
