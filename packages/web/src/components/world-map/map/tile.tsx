import { MapLocationType, Party, PartyOwner } from "@rpg-village/core";

interface TileProperties {
  parties: Party[];
  x: number;
  y: number;
  locationType?: MapLocationType;
}

export const Tile = ({ x, y, parties, locationType }: TileProperties) => {
  return (
    <Group x={x} y={y} size={40}>
      <>
        <Hexagon color="red" size={40} />
        {locationType === MapLocationType.Village && <Circle size={18} color="green" />}
        {locationType === MapLocationType.Portal && <Circle size={18} color="yellow" />}
        {locationType === MapLocationType.Boss && <Circle size={18} color="purple" />}
        {parties && parties.map((party, index) => <PartyDisplay key={party.id} party={party} />)}
      </>
    </Group>
  );
};

interface PartyDisplayProps {
  party: Party;
}

const PartyDisplay = ({ party }: PartyDisplayProps) => {
  if (party.owner === PartyOwner.Player) return <Circle size={14} color="blue" />;
  if (party.owner === PartyOwner.Enemy) return <Circle size={14} color="black" />;

  return null;
};

// w-[80px] w-[80px]
const Group = (props: { children: JSX.Element; size: 40; x: number; y: number }) => (
  <span className="absolute" style={{ top: props.y + "px", left: props.x + "px" }}>
    <span
      className={`relative flex justify-center items-center w-[${props.size * 2}px] h-[${props.size * 2}px] *:absolute`}
    >
      {props.children}
    </span>
  </span>
);

// w-[28px] w-[36px] h-[28px] h-[36px] bg-green-700 bg-black bg-blue-700 bg-green-700 bg-yellow-700 bg-purple-700
const Circle = (props: { size: 14 | 18; color: "blue" | "black" | "green" | "yellow" | "purple" }) => (
  <span
    className={`w-[${props.size * 2}px] h-[${props.size * 2}px] rounded-full bg-${props.color}-700 bg-${props.color}`}
  ></span>
);

// w-[80px] h-[80px] bg-red-700
const Hexagon = (props: { size: 40; color: "red" }) => (
  <span
    className={`w-[${props.size * 2}px] h-[${props.size * 2}px] bg-${props.color}-700`}
    style={{
      clipPath: "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)",
    }}
  ></span>
);
