import { Application, Container, ContainerChild, TilingSprite } from "pixi.js";
import { without } from "rambda";

import { BattlefieldConfig, BattlefieldState, ProjectileNode, Unit } from "../battlefield";
import { inject, injectable } from "./injection-container";
import { AssetManagerToken } from "./interface";
import { ProjectilesContainer } from "./projectiles-container";
import { UnitsContainer } from "./units-container";

@injectable()
export class BattlefieldRenderer {
  private application = new Application();
  private rootContainer = new Container();
  private projectilesContainer = inject(ProjectilesContainer);
  private unitsContainer = inject(UnitsContainer);
  private assetManager = inject(AssetManagerToken);
  private lastState: { units: Unit[]; projectiles: ProjectileNode[] } = { units: [], projectiles: [] };

  async init(config: BattlefieldConfig): Promise<HTMLCanvasElement> {
    await this.application.init({
      width: config.mapSize[0],
      height: config.mapSize[1],
    });

    this.application.stage.addChild(this.rootContainer);

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
    this.unitsContainer.clearAllUnitsSelection();
    units.forEach(unit => this.unitsContainer.selectUnit(unit));
  }

  renderScene(data: BattlefieldState) {
    data.units.forEach(unit => this.unitsContainer.drawUnitAnimation(unit));
    data.projectiles.forEach(projectile => this.projectilesContainer.drawProjectileAnimation(projectile));

    const removedProjectiles = without(data.projectiles, this.lastState.projectiles);
    removedProjectiles.forEach(projectile => this.projectilesContainer.removeProjectile(projectile));

    this.lastState = {
      units: [...data.units],
      projectiles: [...data.projectiles],
    };
  }
}
