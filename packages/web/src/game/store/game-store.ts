import { createStore } from "solid-js/store";

import { GameStoreState } from "./game-store-state";

export const [gameStore, setGameStore] = createStore<GameStoreState>({
  game: null!,
  ai: {
    partyStates: {},
  },
  ui: {
    paused: false,
    ai: true,
  },
});
