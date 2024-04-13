import { For, Show } from "solid-js";

import { MapID, MapLocation } from "@rpg-village/bannerlords";

import { useGameStateSelector } from "@web/store/game";
import { mapLocationsByMapIdSelector, partiesOnLocationSelector } from "@web/store/game";

import { Tile } from "./tile";

interface MapProperties {
  mapId: MapID;
}

export const Map = (props: MapProperties) => {
  const locations = useGameStateSelector(state => mapLocationsByMapIdSelector(state, props.mapId));

  return (
    <Show when={locations()} keyed>
      {locations => (
        <div class="relative" style={{ top: window.innerHeight / 2 + "px", left: window.innerWidth / 2 + "px" }}>
          <For each={locations}>{location => <MapLocationDisplay location={location} />}</For>
        </div>
      )}
    </Show>
  );
};

const MapLocationDisplay = (props: { location: MapLocation }) => {
  const partiesOnLocations = useGameStateSelector(state => partiesOnLocationSelector(state, props.location.id));

  return (
    <Tile
      parties={partiesOnLocations()}
      locationType={props.location.type}
      x={61 * props.location.x}
      y={35 * props.location.y}
    />
  );
};
