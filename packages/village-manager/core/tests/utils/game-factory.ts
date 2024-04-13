import { GameConfig, GameState } from "@rpg-village/core";
import { createGameInstance } from "@rpg-village/core";

interface GameFactory {
  state: Partial<GameState>;
  config: GameConfig;
}

export function gameFactory({ state, config }: GameFactory) {
  const game = createGameInstance(config);

  if (state) {
    game.loadGame(state as GameState);
  }

  return game;
}
