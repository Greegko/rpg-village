import { Container, Sprite } from "pixi.js";

import { Projectile } from "../battlefield";
import { multVector, normVector, subVector } from "../utils";

import { AnimatedSpriteUnit } from "./animated-sprite-unit";
import { AssetManager } from "./interface";

export class ProjectilesContainer extends Container {
  constructor(private assetManager: AssetManager) {
    super();
  }

  private projectileNodes = new Map<Projectile, Sprite>();

  removeProjectile(projectile: Projectile) {
    let node = this.projectileNodes.get(projectile);

    if (!node) return;

    node.destroy();

    this.projectileNodes.delete(projectile);
  }

  drawProjectileAnimation(projectile: Projectile) {
    let node = this.projectileNodes.get(projectile);

    if (!node) {
      node = this.createProjectileNode(projectile);
    }

    const d = multVector(normVector(subVector(projectile.targetLocation, projectile.sourceLocation)), projectile.speed);

    node.x += d.x;
    node.y += d.y;
  }

  private createProjectileNode(projectile: Projectile): Sprite {
    const projectileConfig = this.assetManager.getSprite(projectile.projectileId);
    const projectileNode = new AnimatedSpriteUnit(projectileConfig.texture, projectileConfig.animations, "idle");

    projectileNode.position.copyFrom(projectile.sourceLocation);
    projectileNode.anchor.set(0.5, 0);

    this.projectileNodes.set(projectile, projectileNode);

    this.addChild(projectileNode);

    return projectileNode;
  }
}
