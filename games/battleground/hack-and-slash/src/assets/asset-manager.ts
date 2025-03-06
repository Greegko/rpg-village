import { Texture } from "pixi.js";

import { AssetManager as IAssetManager, SpriteConfig } from "@rpg-village/battleground-core";

import { HerosHoursAssets } from "./hero-hours/hero-hours-assets";
import { TinySwordsAssets } from "./tiny-swords/tiny-swords-assets";

export class AssetManager implements IAssetManager {
  private tinySwordsAssets = new TinySwordsAssets();
  private heroHoursAssets = new HerosHoursAssets();

  async init(): Promise<void> {
    await this.tinySwordsAssets.init();
    await this.heroHoursAssets.init();
  }

  getSprite(assetId: string): SpriteConfig {
    const config = this.tinySwordsAssets.getSprite(assetId) || this.heroHoursAssets.getSprite(assetId);

    if (!config) throw Error(`Sprite does not exist for ${assetId}!`);

    return config;
  }

  getAsset(assetId: string): Texture {
    const texture = this.tinySwordsAssets.getAsset(assetId) || this.heroHoursAssets.getAsset(assetId);

    if (!texture) throw Error(`Texture doesn't exists for ${assetId}!`);

    return texture;
  }
}
