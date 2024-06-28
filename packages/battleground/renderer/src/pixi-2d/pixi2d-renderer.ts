import { without } from "rambda";

import * as PIXI from "pixi.js";
import { Application, Container, Text } from "pixi.js";

import { BattlefieldConfig, Unit } from "@battleground/core";

import { AssetManager, BattlefieldRenderer, BattlefieldRendererConfig, SceneState } from "../interfaces";
import { ProjectileAnimation } from "./projectile-animation";
import { UnitAnimation } from "./unit-animation";

export class Pixi2DRenderer implements BattlefieldRenderer {
  container: Container = new Container();
  assetManager: AssetManager;

  private projectileAnimation: ProjectileAnimation;
  private unitAnimation: UnitAnimation;
  private application: Application = new Application();
  private tickerTextNode = new Text({ text: "", style: { fill: "white", fontSize: 12 } });

  async init(config: BattlefieldRendererConfig & BattlefieldConfig, assetManager: AssetManager) {
    this.assetManager = assetManager;

    globalThis.__PIXI_APP__ = this.application;

    await this.application.init({
      width: config.mapSize[0],
      height: config.mapSize[1],
    });

    config.containerNode.appendChild(this.application.canvas);

    this.registerPixiInspector();

    this.projectileAnimation = new ProjectileAnimation(this);
    this.unitAnimation = new UnitAnimation(this);

    this.application.stage.addChild(this.container);
    this.container.addChild(this.tickerTextNode);
  }

  private lastState: SceneState = { tick: 0, units: [], projectiles: [] };

  selectUnits(units: Unit[]): void {
    this.unitAnimation.clearAllUnitsSelection();
    units.forEach(unit => this.unitAnimation.selectUnit(unit));
  }

  renderScene(data: SceneState) {
    this.updateTickerText();
    this.application.ticker.update(0);

    data.units.forEach(unit => this.unitAnimation.drawUnitAnimation(unit));
    data.projectiles.forEach(projectile => this.projectileAnimation.drawProjectileAnimation(projectile));

    const removedProjectiles = without(data.projectiles, this.lastState.projectiles);
    removedProjectiles.forEach(projectile => this.projectileAnimation.removeProjectile(projectile));

    this.lastState = {
      tick: data.tick,
      units: [...data.units],
      projectiles: [...data.projectiles],
    };
  }

  updateTickerText() {
    this.tickerTextNode.text = this.lastState.tick;
  }

  private registerPixiInspector() {
    (window as any).__PIXI_INSPECTOR_GLOBAL_HOOK__ &&
      (window as any).__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI });
  }
}
