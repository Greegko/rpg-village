import { mapValues, values } from "remeda";
import { For, createMemo } from "solid-js";

import { gameState } from "./game";

const entityIdRefsMap = createMemo(() => ({
  ...gameState().lords,
  ...gameState().villages,
  ...gameState().castles,
  ...gameState().towns,
}));

const map = createMemo(() =>
  mapValues(gameState().map, (position, entityId) => ({
    entity: entityIdRefsMap()[entityId],
    position,
  })),
);

const villages = () => gameState().villages;
const lords = () => gameState().lords;
const towns = () => gameState().towns;
const castles = () => gameState().castles;

export const Map = () => {
  return (
    <div class="relative">
      <For each={values(villages())}>
        {village => (
          <Dot x={map()[village.id].position.x} y={map()[village.id].position.y} size={10} color={"purple"} />
        )}
      </For>

      <For each={values(lords())}>
        {lord => <Dot x={map()[lord.id].position.x} y={map()[lord.id].position.y} size={10} color={"red"} />}
      </For>

      <For each={values(towns())}>
        {town => <Dot x={map()[town.id].position.x} y={map()[town.id].position.y} size={10} color={"yellow"} />}
      </For>

      <For each={values(castles())}>
        {castle => <Dot x={map()[castle.id].position.x} y={map()[castle.id].position.y} size={10} color={"blue"} />}
      </For>
    </div>
  );
};

// w-[10px] h-[10px] bg-purple-700 bg-red-700 bg-yellow-700 bg-blue-700
const Dot = (props: { x: number; y: number; color: "purple" | "red" | "yellow" | "blue"; size: 10 }) => (
  <div
    class={`absolute w-[${props.size}px] h-[${props.size}px] rounded-full bg-${props.color}-700`}
    style={{ top: props.y + "px", left: props.x + "px" }}
  ></div>
);
