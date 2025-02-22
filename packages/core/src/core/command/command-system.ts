import { inject, injectable } from "@lib/dependency-injection";

import { CommandType } from "./command-type";

interface CommandHandlerDecoratorSubscription {
  command: any;
  targetClass: any;
  handlerFunctionName: string;
}

@injectable()
export class CommandSystem {
  static commandHandlerDecorators: CommandHandlerDecoratorSubscription[] | null = [];

  private subscribers: { [key: string]: Function } = {};

  hookCommandHandlers() {
    CommandSystem.commandHandlerDecorators!.forEach(handler => {
      const instance = inject(handler.targetClass.constructor) as any;

      // @ts-ignore
      this.on(handler.command, (args: any) => instance[handler.handlerFunctionName](args));
    });
  }

  on<T extends keyof CommandType>(commandType: T, callback: (args?: CommandType[T]) => void) {
    this.subscribers[commandType] = callback;
  }

  execute<T extends keyof CommandType>(commandType: T, args?: CommandType[T]) {
    this.subscribers[commandType](args);
  }
}
