import { Application, Container, ContainerChild, Graphics } from "pixi.js";
import { values, without } from "rambda";

import { Position } from "@rpg-village/utils/node";

import { Map } from "@/features/map";
import { Unit, UnitID } from "@/features/unit";

import { BattlefieldState } from "../battlefield";
import { inject } from "./injection-container";
import { AssetManagerToken } from "./interface";
import { Node } from "./node/create-node";
import { createMapObjectNode, createProjectileNode, createUnitNode } from "./node/unit-node";

export type Size = [number, number];

export interface BattlefieldRendererConfig {
  cameraPosition: Position;
  viewport: Size;
}

export class BattlefieldRenderer {
  private assetManager = inject(AssetManagerToken);

  private application = new Application();
  private rootContainer = new Container();
  private projectilesContainer = new Container();
  private backgroundContainer = new Container();
  private unitsContainer = new Container();

  private unitNodes: Record<string, Node> = {};
  private projectileNodes: Record<string, Node> = {};
  private mapObjectNodes: Record<string, Node> = {};

  private lastState: BattlefieldState = { units: [], projectiles: [], mapObjects: [] };
  private focusOnUnit: UnitID | null = null;
  private config: BattlefieldRendererConfig;

  readonly onReady: Promise<void>;

  constructor(config: BattlefieldRendererConfig) {
    this.config = config;

    this.onReady = this.application.init({
      width: config.viewport[0],
      height: config.viewport[1],
    });

    this.application.stage.addChild(this.rootContainer);

    if (import.meta.env.DEV) {
      (globalThis as any).__PIXI_APP__ = this.application;
    }

    this.rootContainer.addChild(this.backgroundContainer);
    this.rootContainer.addChild(this.unitsContainer);
    this.rootContainer.addChild(this.projectilesContainer);
  }

  setFocusOnUnit(unitId: UnitID) {
    this.focusOnUnit = unitId;
  }

  setMap(map: Map) {
    const toPosition = (i: number) => ({
      x: (i * map.tileSize) % map.size[0],
      y: Math.floor((i * map.tileSize) / map.size[0]) * map.tileSize,
    });

    map.tiles.forEach((tile, i) => {
      const texture = this.assetManager.getAsset(tile);
      const node = new Graphics();
      node.texture(texture);
      node.position.copyFrom(toPosition(i));

      this.backgroundContainer.addChild(node);
    });
  }

  getCanvas(): HTMLCanvasElement {
    return this.application.canvas;
  }

  addChild(containerChild: ContainerChild) {
    this.rootContainer.addChild(containerChild);
  }

  selectUnits(units: Unit[]): void {
    values(this.unitNodes).forEach(unitNode => unitNode.unselect());

    units.forEach(unit => this.unitNodes[unit.id].select());
  }

  private moveToPosition(position: Position) {
    this.rootContainer.position.x = -Math.max(
      0,
      Math.min(this.rootContainer.width - this.config.viewport[0], position.x - this.config.viewport[0] / 2),
    );
    this.rootContainer.position.y = -Math.max(
      0,
      Math.min(this.rootContainer.height - this.config.viewport[1], position.y - this.config.viewport[1] / 2),
    );
  }

  renderScene(data: BattlefieldState) {
    if (this.focusOnUnit) {
      const focusUnit = data.units.find(x => x.id === this.focusOnUnit)!;

      this.moveToPosition(focusUnit.position);
    }

    data.units.forEach(unit => {
      if (this.unitNodes[unit.id] === undefined) {
        this.unitNodes[unit.id] = createUnitNode();
        this.unitsContainer.addChild(this.unitNodes[unit.id].getRoot());
      }

      this.unitNodes[unit.id].setState(unit);
    });

    data.projectiles.forEach(projectile => {
      if (this.projectileNodes[projectile.id] === undefined) {
        this.projectileNodes[projectile.id] = createProjectileNode();
        this.projectilesContainer.addChild(this.projectileNodes[projectile.id].getRoot());
      }

      this.projectileNodes[projectile.id].setState(projectile);
    });

    data.mapObjects.forEach(mapObject => {
      if (this.projectileNodes[mapObject.id] === undefined) {
        this.mapObjectNodes[mapObject.id] = createMapObjectNode();
        this.backgroundContainer.addChild(this.mapObjectNodes[mapObject.id].getRoot());
      }

      this.mapObjectNodes[mapObject.id].setState(mapObject);
    });

    const removedProjectiles = without(data.projectiles, this.lastState.projectiles);
    removedProjectiles.forEach(projectile => {
      this.projectilesContainer.removeChild(this.projectileNodes[projectile.id].getRoot());

      this.projectileNodes[projectile.id].getRoot().destroy();
      delete this.projectileNodes[projectile.id];
    });

    this.lastState = {
      units: [...data.units],
      mapObjects: [...data.mapObjects],
      projectiles: [...data.projectiles],
    };
  }
}
