import { Assets, Spritesheet, Texture } from "pixi.js";

import { SpriteConfig } from "@rpg-village/battleground-core";

import sprite_json from "./assets.json";
import sprite_png_url from "./assets.png";

export class HerosHoursAssets {
  private spriteSheet!: Spritesheet;

  async init(): Promise<Record<string, Texture>> {
    return Assets.load(sprite_png_url).then(spriteTexture => {
      this.spriteSheet = new Spritesheet(spriteTexture, sprite_json);
      return this.spriteSheet.parse();
    });
  }

  getSprite(assetId: string): SpriteConfig | null {
    const texture = this.spriteSheet.textures[assetId + ".png"] || this.spriteSheet.animations[assetId];

    if (!texture) return null;

    return {
      texture: Array.isArray(texture) ? texture : [texture],
      animations: {
        idle: [0, 4],
        move: [4, 8],
        attack: [8, 12],
        hurt: [12, 16],
        die: [16, 20],
        dead: 19,
      },
    };
  }

  getAsset(assetId: string): Texture | null {
    const texture = this.spriteSheet.textures[assetId + ".png"];

    if (!texture) return null;

    return texture;
  }
}
