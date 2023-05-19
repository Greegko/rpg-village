import { CommandSystem } from "./command-system";
import { CommandType } from "./command-type";

export function commandHandler(commandType: keyof CommandType) {
  return (targetClass: any, handlerFunctionName: string) => {
    CommandSystem.commandHandlerDecorators!.push({
      command: commandType,
      targetClass,
      handlerFunctionName,
    });
  };
}
