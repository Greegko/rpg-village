import { createInjectableToken } from "@greegko/tiny-di";
import { Texture } from "pixi.js";

export type AnimationStateID = string;
export type AnimationFrame = number | [number, number];

export interface SpriteConfig {
  texture: Texture[];
  animations: Record<string, number | [number, number]>;
}

export interface AssetManager {
  init(): Promise<void>;
  getSprite(assetId: string): SpriteConfig;
  getAsset(assetId: string): Texture;
}

export const AssetManagerToken = createInjectableToken<AssetManager>("AssetManagerToken");
