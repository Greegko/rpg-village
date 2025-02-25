import { BattlefieldRenderer } from "./battlefield-renderer";
import { inject, makeInjectable } from "./injection-container";
import { AssetManager, AssetManagerToken } from "./interface";

export const createRendererInstance = (assetManager: AssetManager): BattlefieldRenderer => {
  makeInjectable(AssetManagerToken, assetManager);
  return inject(BattlefieldRenderer);
};
