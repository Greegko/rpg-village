import { Type, createInjectableToken } from "@lib/dependency-injection";

import { CommandType } from "@rpg-village/core/extend";

export interface CommandHandler {
  commandType: keyof CommandType;
  targetInstance: InstanceType<Type>;
  handlerFunctionName: string;
}

export const commandHandlersToken = createInjectableToken<CommandHandler>("CommandHandlersToken");
