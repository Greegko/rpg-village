import * as React from 'react';
import { RegularPolygon, Circle } from 'react-konva';
import { Party, PartyOwner } from '@rpg-village/core';

interface TileProperties {
  parties: Party[];
  x: number;
  y: number;
  onClick?: () => void;
}

export const Tile = ({ x, y, onClick, parties }: TileProperties) => (
  <>
    <RegularPolygon sides={6} radius={40} rotation={90} x={x} y={y} onClick={onClick} fill="red" />
    {parties && parties[0] && parties[0].owner === PartyOwner.Player && <Circle radius={14} fill="blue" x={x} y={y} />}
    {parties && parties[0] && parties[0].owner === PartyOwner.Enemy && <Circle radius={14} fill="black" x={x} y={y} />}
    {parties && parties[1] && parties[1].owner === PartyOwner.Player && <Circle radius={14} fill="blue" x={x + 4} y={y + 4} />}
    {parties && parties[1] && parties[1].owner === PartyOwner.Enemy && <Circle radius={14} fill="black" x={x + 4} y={y + 4} />}
  </>
)
