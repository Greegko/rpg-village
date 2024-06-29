import { Point, Rectangle } from "./interface";

export function toRectangleFromPoints(p1: Point, p2: Point): Rectangle {
  return { top: p1.y, bottom: p2.y, left: p1.x, right: p2.x };
}

export function toRectangleFromPoint(p: Point): Rectangle {
  return { top: p.y, bottom: p.y, left: p.x, right: p.x };
}

export function toRectangleFromCords(x: number, y: number, x2: number, y2: number): Rectangle {
  return { top: y, bottom: y2, left: x, right: x2 };
}
