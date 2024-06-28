import { Application, Assets, Sprite, Spritesheet, Texture } from "pixi.js";

import { Dictionary } from "rambda";
import { AssetManager, SpriteConfig } from "@rpg-village/battleground";

// @ts-ignore
import sprite_json from "./assets.json";
// @ts-ignore
import sprite_png_url from "./assets.png";

export class HerosHoursAssetManager implements AssetManager {
  private spriteSheet: Spritesheet;
  private assetRenderApplication: Application = new Application();

  async init(): Promise<Dictionary<Texture>> {
    await this.assetRenderApplication.init({ autoStart: false });

    return Assets.load(sprite_png_url).then(spriteTexture => {
      this.spriteSheet = new Spritesheet(spriteTexture, sprite_json);
      return this.spriteSheet.parse();
    });
  }

  getSprite(assetId: string): SpriteConfig {
    const texture = this.spriteSheet.textures[assetId + ".png"] || this.spriteSheet.animations[assetId];

    if (!texture) throw Error(`Texture doesn't exists for ${assetId}!`);

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

  getAsset(assetId: string): Texture {
    const spellSheetTexture = this.spriteSheet.textures[assetId + ".png"];

    if (!spellSheetTexture) throw Error(`Texture doesn't exists for ${assetId}!`);

    return spellSheetTexture;
  }

  async getAssetAsBase64(assetId: string): Promise<string> {
    const spellSheetTexture = this.spriteSheet.textures[assetId + ".png"];

    if (!spellSheetTexture) throw Error(`Texture doesn't exists for ${assetId}!`);

    const sprite = new Sprite(spellSheetTexture);
    const base64 = this.assetRenderApplication.renderer.extract.base64(sprite);

    sprite.destroy();

    return base64;
  }
}
