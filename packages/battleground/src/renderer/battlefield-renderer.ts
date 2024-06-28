import { without } from "rambda";

import { Application, Container, Text, ContainerChild } from "pixi.js";

import { BattlefieldConfig, BattlefieldState, Unit } from "../battlefield";

import { ProjectilesContainer } from "./projectiles-container";
import { UnitsContainer } from "./units-container";
import { AssetManager } from "./interface";

export class BattlefieldRenderer {
  private application: Application;
  private rootContainer: Container;
  private tickerTextNode: Text;
  private lastState: BattlefieldState;
  private unitsContainer: UnitsContainer;
  private projectilesContainer: ProjectilesContainer;

  constructor(private assetManager: AssetManager) {
    this.application = new Application();
    this.rootContainer = new Container();
    this.projectilesContainer = new ProjectilesContainer(this.assetManager);
    this.unitsContainer = new UnitsContainer(this.assetManager);
    this.tickerTextNode = new Text({ text: "", style: { fill: "white", fontSize: 12 } });
    this.lastState = { tick: 0, units: [], projectiles: [] };
  }

  async init(config: BattlefieldConfig): Promise<HTMLCanvasElement> {
    await this.application.init({
      width: config.mapSize[0],
      height: config.mapSize[1],
    });

    this.application.stage.addChild(this.rootContainer);
    this.rootContainer.addChild(this.tickerTextNode);
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
    this.updateTickerText();
    this.application.ticker.update(0);

    data.units.forEach(unit => this.unitsContainer.drawUnitAnimation(unit));
    data.projectiles.forEach(projectile => this.projectilesContainer.drawProjectileAnimation(projectile));

    const removedProjectiles = without(data.projectiles, this.lastState.projectiles);
    removedProjectiles.forEach(projectile => this.projectilesContainer.removeProjectile(projectile));

    this.lastState = {
      tick: data.tick,
      units: [...data.units],
      projectiles: [...data.projectiles],
    };
  }

  updateTickerText() {
    this.tickerTextNode.text = this.lastState.tick;
  }
}
