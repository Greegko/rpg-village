import { injectable } from "inversify";
import { forEach } from "remeda";

import { GameEvent, eventHandler } from "@rpg-village/core";

import { Point } from "./interface";
import { MapMoveDirectionStore } from "./map-move-direction-store";
import { MapStore } from "./map-store";

@injectable()
export class MapEventHandler {
  constructor(private mapMoveDirectionStore: MapMoveDirectionStore, private mapStore: MapStore) {}

  @eventHandler(GameEvent.Turn)
  moveEntities() {
    const entities = Object.entries(this.mapMoveDirectionStore.getState());

    forEach(entities, ([entityId, direction]) =>
      this.mapStore.set(entityId, point => movePointByAngle(point!, direction, 1)),
    );
  }
}

function movePointByAngle(point: Point, angle: number, speed: number): Point {
  const newX = point.x + round(Math.cos(angle) * speed, 2);
  const newY = point.y + round(Math.sin(angle) * speed, 2);
  return { x: newX, y: newY };
}

const round = (val: number, precision: number) => Math.round(val * 10 ** precision) / 10 ** precision;
