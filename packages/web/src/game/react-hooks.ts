import { createContext, useContext } from "react";

import { GameInstanceWrapper } from "./game-instance-wrapper";

export const GameInstanceWrapperContext = createContext<GameInstanceWrapper>(null as any);

export function useGameExecuteCommand() {
  const gameInstance = useContext(GameInstanceWrapperContext);

  return gameInstance.executeCommand.bind(gameInstance);
}
