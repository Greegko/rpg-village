import { Type, inject } from "@lib/dependency-injection";

import { CommandType } from "@rpg-village/core/extend";

import { CommandSystem } from "./command-system";

export function commandHandler(commandType: keyof CommandType) {
  return (targetInstance: InstanceType<Type>, handlerFunctionName: string) => {
    const commandSystem = inject(CommandSystem);

    commandSystem.registerCommand({
      commandType,
      targetInstance,
      handlerFunctionName,
    });
  };
}
