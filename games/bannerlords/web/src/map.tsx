import { mapValues, values } from "remeda";
import { For, createMemo } from "solid-js";

import { gameState } from "./game";

const entityIdRefsMap = createMemo(() => ({
  ...gameState().lords,
  ...gameState().villages,
  ...gameState().castles,
  ...gameState().towns,
}));

const mapElements = createMemo(() =>
  mapValues(gameState().map, (position, entityId) => ({
    entityId,
    entity: entityIdRefsMap()[entityId],
    position,
  })),
);

const getColor = (entityId: string): "purple" | "red" | "yellow" | "blue" => {
  return (
    (gameState().parties[entityId] && "blue") ||
    (gameState().villages[entityId] && "yellow") ||
    (gameState().castles[entityId] && "blue") ||
    (gameState().towns[entityId] && "red")
  );
};

export const Map = () => {
  return (
    <div class="relative">
      <For each={values(mapElements())}>
        {mapElement => (
          <Dot x={mapElement.position.x} y={mapElement.position.y} size={10} color={getColor(mapElement.entityId)} />
        )}
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
