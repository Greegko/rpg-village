import { keys } from "rambda";
import { For, Show, createSignal } from "solid-js";

import { VillageID } from "@rpg-village/village-manager-core";

import { mapsSelector, useGameStateSelector, worldMapIdSelector } from "@web/store/game";
import { mapSelector, setMap, useGameUiStateSelector } from "@web/store/ui";

import { DeveloperToolbox } from "./developer-toolbox";
import { VillageStats } from "./villagestats";

import "./header.scss";

const Maps = () => {
  const maps = useGameStateSelector(mapsSelector);
  const worldMapId = useGameStateSelector(worldMapIdSelector);
  const selectedMapId = useGameUiStateSelector(mapSelector);

  return (
    <div class="flex items-center">
      <For each={keys(maps())}>
        {mapId => (
          <button onClick={() => setMap(mapId)} class={selectedMapId() === mapId ? "active" : ""}>
            {mapId === worldMapId() ? "World Map" : mapId}
          </button>
        )}
      </For>
    </div>
  );
};

export const Header = (props: { villageId: VillageID }) => {
  const [devToolboxVisible, setDevToolboxVisibile] = createSignal<boolean>();

  return (
    <div class="header">
      <VillageStats villageId={props.villageId} />

      <Maps />

      <button
        class={"w-[125px] " + (devToolboxVisible() ? " active" : "")}
        onClick={() => setDevToolboxVisibile(val => !val)}
      >
        Dev Toolbox
      </button>

      <Show when={devToolboxVisible()}>
        <DeveloperToolbox />
      </Show>
    </div>
  );
};
