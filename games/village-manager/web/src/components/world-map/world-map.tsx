import { Show } from "solid-js";

import { gameStore } from "@web/store/game-store";

import { Map } from "./map/map";

export const WorldMap = () => (
  <Show when={gameStore.ui.map}>
    <div class="fixed top-0 left-0 right-0 bottom-0 -z-10 bg-[#2e342b]">
      <Map mapId={gameStore.ui.map!} />
    </div>
  </Show>
);
