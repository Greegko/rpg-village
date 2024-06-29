import { expect, it } from "vitest";

import { SpatialHash } from "./spatial-hash";
import { Rectangle } from "./interface";
import { toRectangleFromPoints } from "./utils";

type Node = { id: string; rect: Rectangle };

it("should lookup hash", () => {
  const hash = new SpatialHash<Node>(50, x => x.rect);

  const node: Node = { id: "1", rect: toRectangleFromPoints({ x: 0, y: 0 }, { x: 50, y: 50 }) };

  hash.set(node);

  const set = hash.search(toRectangleFromPoints({ x: 50, y: 50 }, { x: 50, y: 50 }));

  expect(set.size).toBe(1);
});

it("should unset removed nodes", () => {
  const hash = new SpatialHash<Node>(50, x => x.rect);

  const node: Node = { id: "1", rect: toRectangleFromPoints({ x: 0, y: 0 }, { x: 50, y: 50 }) };

  hash.set(node);
  hash.remove(node);

  const set = hash.search(toRectangleFromPoints({ x: 50, y: 50 }, { x: 50, y: 50 }));

  expect(set.size).toBe(0);
});
