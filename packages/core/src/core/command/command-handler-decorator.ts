import { CommandType } from "@rpg-village/core/extend";

import { CommandSystem } from "./command-system";

export function commandHandler(commandType: keyof CommandType) {
  return (targetClass: any, handlerFunctionName: string) => {
    CommandSystem.commandHandlerDecorators!.push({
      command: commandType,
      targetClass,
      handlerFunctionName,
    });
  };
}
