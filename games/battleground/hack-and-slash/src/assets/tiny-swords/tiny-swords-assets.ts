import { Assets, Spritesheet, Texture } from "pixi.js";

import { SpriteConfig } from "@rpg-village/battleground-core";

import sprite_json from "./assets.json";
import sprite_png_url from "./assets.png";

const assetAlias: Record<string, string> = {
  gtl: "Terrain/Tilemap_Flat/Tilemap_Flat-11.png",
  gtm: "Terrain/Tilemap_Flat/Tilemap_Flat-11.png",
  gtr: "Terrain/Tilemap_Flat/Tilemap_Flat-11.png",
  gml: "Terrain/Tilemap_Flat/Tilemap_Flat-11.png",
  gmm: "Terrain/Tilemap_Flat/Tilemap_Flat-11.png",
  gmr: "Terrain/Tilemap_Flat/Tilemap_Flat-11.png",
  gbl: "Terrain/Tilemap_Flat/Tilemap_Flat-11.png",
  gbm: "Terrain/Tilemap_Flat/Tilemap_Flat-11.png",
  gbr: "Terrain/Tilemap_Flat/Tilemap_Flat-11.png",
};

export class TinySwordsAssets {
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
        idle: [0, 6],
        move: [6, 14],
        attack: [8, 12],
        hurt: [12, 16],
        die: [16, 20],
        dead: 19,
      },
    };
  }

  getAsset(assetId: string): Texture | null {
    const assetKey = assetAlias[assetId] ?? assetId + ".png";
    const texture = this.spriteSheet.textures[assetKey];

    if (!texture) return null;

    return texture;
  }
}
