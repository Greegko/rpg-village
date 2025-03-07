import { merge } from "rambda";

import { MapObjectInit, UnitInit } from "@rpg-village/battleground-core";

import { createDummyUnit, createWeakDummyUnit, getConfig, heroUnit } from "./config";

// prettier-ignore
enum TileOrientation { 
  TL = 'tl', TM = 'tm', TR = 'tr',
  ML = 'ml', MM = 'mm', MR = 'mr',
  BL = 'bl', BM = 'bm', BR = 'br'
}

enum TileType {
  Grass = "g",
  Water = "w",
  Rock = "r",
}

type Tile = `${TileType}${TileOrientation}`;

export interface Map {
  size: [number, number];
  tileSize: number;
  tiles: Tile[];
  units: UnitInit[];
  mapObjects: MapObjectInit[];
}

export function generateMap(): Map {
  const size = [1280, 1024] as [number, number];
  const tileSize = 64;
  const tileRows = size[1] / tileSize;
  const tileColumns = size[0] / tileSize;

  const tiles: Tile[] = [];

  for (let i = 0; i < tileColumns; i++) {
    for (let k = 0; k < tileRows; k++) {
      tiles.push(`gmm`);
    }
  }

  const mapObjects = [merge(getConfig("golden-chest"), { position: { x: 200, y: 200 } })];
  const units = [
    createWeakDummyUnit({ position: { x: 400, y: 100 }, team: 2 }),
    createDummyUnit({ position: { x: 450, y: 100 }, team: 2 }),

    heroUnit({ position: { x: 400, y: 700 }, team: 1 }),
  ];

  return {
    size,
    tileSize,
    tiles,
    units,
    mapObjects,
  };
}
