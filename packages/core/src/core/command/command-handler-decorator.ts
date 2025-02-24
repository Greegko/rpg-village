import { Type, makeInjectable } from "@lib/dependency-injection";

import { CommandType } from "@rpg-village/core/extend";

import { commandHandlersToken } from "./command-handlers-token";

export function commandHandler(commandType: keyof CommandType) {
  return (targetInstance: InstanceType<Type>, handlerFunctionName: string) => {
    makeInjectable(
      commandHandlersToken,
      {
        commandType,
        targetInstance,
        handlerFunctionName,
      },
      { multi: true },
    );
  };
}
