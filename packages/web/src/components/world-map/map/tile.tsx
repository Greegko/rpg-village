import { Circle, Group, RegularPolygon } from "react-konva";

import { MapLocationType, Party, PartyOwner } from "@rpg-village/core";

interface TileProperties {
  parties: Party[];
  x: number;
  y: number;
  locationType?: MapLocationType;
}

export const Tile = ({ x, y, parties, locationType }: TileProperties) => {
  return (
    <Group>
      <RegularPolygon sides={6} radius={40} rotation={90} x={x} y={y} fill="red" />
      {locationType === MapLocationType.Village && <Circle radius={18} fill="green" x={x} y={y} />}
      {locationType === MapLocationType.Portal && <Circle radius={18} fill="yellow" x={x} y={y} />}
      {locationType === MapLocationType.Boss && <Circle radius={18} fill="purple" x={x} y={y} />}
      {parties && parties.map((party, index) => <Party key={party.id} party={party} x={x + index * 4} y={y + index * 4} /> )}
    </Group>
  );
};

interface PartyProps { party: Party; x: number; y: number };
const Party = ({ party, x, y }: PartyProps) => {
  if(party.owner === PartyOwner.Player) return <Circle radius={14} fill="blue" x={x} y={y} />;
  if(party.owner === PartyOwner.Enemy) return <Circle radius={14} fill="black" x={x} y={y} />;

  return null;
}
