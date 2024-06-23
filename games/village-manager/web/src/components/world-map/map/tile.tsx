import { For, JSX, Match, Switch } from "solid-js";

import { MapLocationType, Party, PartyOwner } from "@rpg-village/village-manager";

interface TileProperties {
  parties: Party[];
  x: number;
  y: number;
  locationType?: MapLocationType;
}

export const Tile = (props: TileProperties) => (
  <Group x={props.x} y={props.y} size={40}>
    <Hexagon color="red" size={40} />
    <Switch>
      <Match when={props.locationType === MapLocationType.Village}>
        <Circle size={18} color="green" />
      </Match>
      <Match when={props.locationType === MapLocationType.Portal}>
        <Circle size={18} color="yellow" />
      </Match>
      <Match when={props.locationType === MapLocationType.Boss}>
        <Circle size={18} color="purple" />
      </Match>
    </Switch>
    <For each={props.parties}>
      {(party, index) => (
        <Group x={index() * 5} y={index() * 5} size={40}>
          <PartyDisplay party={party} />
        </Group>
      )}
    </For>
  </Group>
);

interface PartyDisplayProps {
  party: Party;
}

const PartyDisplay = ({ party }: PartyDisplayProps) => (
  <Switch>
    <Match when={party.owner === PartyOwner.Player}>
      <Circle size={14} color="blue" />
    </Match>
    <Match when={party.owner === PartyOwner.Enemy}>
      <Circle size={14} color="black" />
    </Match>
  </Switch>
);

// w-[80px] w-[80px]
const Group = (props: { children: JSX.Element | JSX.Element[]; size: 40; x: number; y: number }) => (
  <span class="absolute" style={{ top: props.y + "px", left: props.x + "px" }}>
    <span
      class={`relative flex justify-center items-center w-[${props.size * 2}px] h-[${props.size * 2}px] *:absolute`}
    >
      {props.children}
    </span>
  </span>
);

// w-[28px] w-[36px] h-[28px] h-[36px] bg-green-700 bg-black bg-blue-700 bg-green-700 bg-yellow-700 bg-purple-700
const Circle = (props: { size: 14 | 18; color: "blue" | "black" | "green" | "yellow" | "purple" }) => (
  <span
    class={`w-[${props.size * 2}px] h-[${props.size * 2}px] rounded-full bg-${props.color}-700 bg-${props.color}`}
  ></span>
);

// w-[80px] h-[80px] bg-red-700
const Hexagon = (props: { size: 40; color: "red" }) => (
  <span
    class={`w-[${props.size * 2}px] h-[${props.size * 2}px] bg-${props.color}-700`}
    style={{
      "clip-path": "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)",
    }}
  ></span>
);
