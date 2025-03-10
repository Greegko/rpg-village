export type Position = { x: number; y: number };

export const getPositionDistance = (a: Position, b: Position) => Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
