import { GameState, createGameInstance } from '../src';
import * as modules from '../src';

interface GameFactory {
  state: Partial<GameState>;
}

export function gameFactory({ state }: Partial<GameFactory> = {}) {
  const game = createGameInstance<GameState>({
    modules: [
      modules.gameModule, modules.configModule, modules.worldModule, modules.villageModule, modules.buildingsModule,
      modules.partyModule, modules.battleModule, modules.skillModule
    ]
  });

  if (state) {
    game.loadGame(state as GameState);
  }

  return game;
}
