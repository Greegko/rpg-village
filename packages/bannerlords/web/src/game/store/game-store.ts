import { createStore, unwrap } from "solid-js/store";

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
  debug: {
    commandHistory: [],
  },
});

export function saveStoreIntoLocalStorage() {
  localStorage.setItem("gameState", JSON.stringify(unwrap(gameStore)));
}

export function restoreStateFromLocalStorage() {
  if (localStorage.getItem("gameState")) {
    setGameStore(JSON.parse(localStorage.getItem("gameState")!) as GameStoreState);
  }
}

export function clearStateFromLocalStorage() {
  localStorage.removeItem("gameState");
}
