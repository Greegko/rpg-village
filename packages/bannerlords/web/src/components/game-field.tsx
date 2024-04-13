import { Show } from "solid-js";

import { gameStore } from "@web/store";

import { Dashboard } from "./dashboard";
import { WorldMap } from "./world-map/world-map";

export const GameField = () => (
  <Show when={gameStore.game}>
    <Dashboard />
    <WorldMap />
  </Show>
);
