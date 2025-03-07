import { BattlefieldRenderer, BattlefieldRendererConfig } from "./battlefield-renderer";
import { makeInjectable } from "./injection-container";
import { AssetManager, AssetManagerToken } from "./interface";

export const createRendererInstance = (config: BattlefieldRendererConfig, assetManager: AssetManager): BattlefieldRenderer => {
  makeInjectable(AssetManagerToken, assetManager);

  return new BattlefieldRenderer(config);
};
