import { GameState, createGameInstance } from '../src';
import * as modules from '../src';

interface GameFactory {
  state: Partial<GameState>;
  triggerNewGameEvent: boolean;
}

export function gameFactory({ state, triggerNewGameEvent = true }: Partial<GameFactory> = {}) {
  const game = createGameInstance<GameState>({
    modules: [
      modules.gameModule, modules.configModule, modules.worldModule, modules.villageModule, modules.buildingsModule,
      modules.partyModule, modules.battleModule, modules.skillModule
    ]
  });

  if (state) {
    game.loadGame(state as GameState);
  }

  if (triggerNewGameEvent) {
    game.startNewGame();
  }

  return game;
}
