import { Application, Container, ContainerChild, TilingSprite } from "pixi.js";
import { values, without } from "rambda";

import { BattlefieldConfig, BattlefieldState, Projectile, Unit } from "../battlefield";
import { inject, injectable } from "./injection-container";
import { AssetManagerToken } from "./interface";
import { createProjectileNode, createUnitNode } from "./node/unit-node";

@injectable()
export class BattlefieldRenderer {
  private application = new Application();
  private rootContainer = new Container();
  private projectilesContainer = new Container();
  private unitsContainer = new Container();
  private unitNodes: Record<string, ReturnType<typeof createUnitNode>> = {};
  private projectileNodes: Record<string, ReturnType<typeof createProjectileNode>> = {};
  private assetManager = inject(AssetManagerToken);
  private lastState: { units: Unit[]; projectiles: Projectile[] } = { units: [], projectiles: [] };

  async init(config: BattlefieldConfig): Promise<HTMLCanvasElement> {
    await this.application.init({
      width: config.mapSize[0],
      height: config.mapSize[1],
    });

    this.application.stage.addChild(this.rootContainer);

    if (import.meta.env.DEV) {
      (globalThis as any).__PIXI_APP__ = this.application;
    }

    const backgroundTitleTexture = this.assetManager.getAsset("overworld_tileset_grass/overworld_tileset_grass-0");
    const backgroundTitle = new TilingSprite({
      texture: backgroundTitleTexture,
      width: config.mapSize[0],
      height: config.mapSize[1],
    });

    this.rootContainer.addChild(backgroundTitle);

    this.rootContainer.addChild(this.unitsContainer);
    this.rootContainer.addChild(this.projectilesContainer);

    return this.application.canvas;
  }

  addChild(containerChild: ContainerChild) {
    this.rootContainer.addChild(containerChild);
  }

  selectUnits(units: Unit[]): void {
    values(this.unitNodes).forEach(unitNode => unitNode.unselect());

    units.forEach(unit => this.unitNodes[unit.id].select());
  }

  renderScene(data: BattlefieldState) {
    data.units.forEach(unit => {
      if (this.unitNodes[unit.id] === undefined) {
        this.unitNodes[unit.id] = createUnitNode();
        this.unitsContainer.addChild(this.unitNodes[unit.id].getNode());
      }

      this.unitNodes[unit.id].setState(unit);
    });

    data.projectiles.forEach(projectile => {
      if (this.projectileNodes[projectile.id] === undefined) {
        this.projectileNodes[projectile.id] = createProjectileNode();
        this.projectilesContainer.addChild(this.projectileNodes[projectile.id].getNode());
      }

      this.projectileNodes[projectile.id].setState(projectile);
    });

    const removedProjectiles = without(data.projectiles, this.lastState.projectiles);
    removedProjectiles.forEach(projectile => {
      this.projectilesContainer.removeChild(this.projectileNodes[projectile.id].getNode());

      this.projectileNodes[projectile.id].getNode().destroy();
      delete this.projectileNodes[projectile.id];
    });

    this.lastState = {
      units: [...data.units],
      projectiles: [...data.projectiles],
    };
  }
}
