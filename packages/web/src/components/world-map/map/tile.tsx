import { RegularPolygon, Circle, Group } from 'react-konva';
import { MapLocationType, Party, PartyOwner } from '@rpg-village/core';

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
      {parties && parties[0] && parties[0].owner === PartyOwner.Player && <Circle radius={14} fill="blue" x={x} y={y} />}
      {parties && parties[0] && parties[0].owner === PartyOwner.Enemy && <Circle radius={14} fill="black" x={x} y={y} />}
      {parties && parties[1] && parties[1].owner === PartyOwner.Player && <Circle radius={14} fill="blue" x={x + 4} y={y + 4} />}
      {parties && parties[1] && parties[1].owner === PartyOwner.Enemy && <Circle radius={14} fill="black" x={x + 4} y={y + 4} />}
    </Group>
  );
};
