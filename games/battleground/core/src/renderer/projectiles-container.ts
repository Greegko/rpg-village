import { Container, Sprite } from "pixi.js";

import { ProjectileNode } from "../battlefield";
import { AnimatedSpriteUnit } from "./animated-sprite-unit";
import { AssetManager } from "./interface";

export class ProjectilesContainer extends Container {
  constructor(private assetManager: AssetManager) {
    super();
  }

  private projectileNodes = new Map<ProjectileNode, Sprite>();

  removeProjectile(projectile: ProjectileNode) {
    let node = this.projectileNodes.get(projectile);

    if (!node) return;

    node.destroy();

    this.projectileNodes.delete(projectile);
  }

  drawProjectileAnimation(projectile: ProjectileNode) {
    let node = this.projectileNodes.get(projectile);

    if (!node) {
      node = this.createProjectileNode(projectile);
    }

    node.x = projectile.location.x;
    node.y = projectile.location.y;
  }

  private createProjectileNode(projectile: ProjectileNode): Sprite {
    const projectileConfig = this.assetManager.getSprite(projectile.id);
    const projectileNode = new AnimatedSpriteUnit(projectileConfig.texture, projectileConfig.animations, "idle");

    projectileNode.position.copyFrom(projectile.sourceLocation);
    projectileNode.anchor.set(0.5, 0);

    this.projectileNodes.set(projectile, projectileNode);

    this.addChild(projectileNode);

    return projectileNode;
  }
}
